'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { webcrypto } = require('node:crypto');
const root = path.join(__dirname, '..');
const fixture = JSON.parse(fs.readFileSync(path.join(root, 'data/requests.json'), 'utf8'));
const brief = fs.readFileSync(path.join(root, '_context/feature_brief.md'), 'utf8');
function runtime() {
  const handlers = {};
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, { textContent: '', value: '', dataset: {}, focus() {}, querySelector() { return null; } });
    return elements.get(id);
  };
  const sandbox = vm.createContext({ console, Intl, structuredClone, crypto: webcrypto,
    FormData: class { constructor(data) { this.data = data; } getAll(key) { return this.data[key] || []; } get(key) { return this.data[key] ?? null; } },
    Date: class extends Date { static now() { return 0; } },
    document: { getElementById: element, addEventListener: (type, fn) => { handlers[type] = fn; } }
  });
  vm.runInContext(fs.readFileSync(path.join(root, 'src/app.js'), 'utf8').replace(/init\(\);\s*$/, ''), sandbox);
  sandbox.fixture = structuredClone(fixture);
  vm.runInContext("state.data = fixture; state.selectedProfile = 'ENT-001'; state.venueId = 'VEN-001'; state.selectedItem = 'REQ-001'; render = () => {};", sandbox);
  const run = code => vm.runInContext(code, sandbox);
  const read = code => JSON.parse(JSON.stringify(run(code)));
  const click = action => handlers.click({ target: { closest: () => ({ dataset: { action } }) } });
  return { run, read, click, handlers, element };
}
test('runtime schema: references, IDs, enums, budgets, validation, chronology and profiles', () => {
  const d = fixture;
  const ids = new Set(); const bookingKeys = new Set();
  assert.equal(d.metadata.identifier_field, 'request_id');
  assert.ok(d.items.length >= 25);
  for (const r of d.items) {
    assert.ok(!ids.has(r.request_id)); ids.add(r.request_id);
    const key = d.metadata.validation.duplicate_key.map(k => r[k]).join('|');
    assert.ok(!bookingKeys.has(key)); bookingKeys.add(key);
    assert.ok(d.entertainers.some(p => p.entertainer_id === r.entertainer_id && p.entertainer_name === r.entertainer_name));
    assert.ok(d.venues.some(v => v.venue_id === r.venue_id && v.venue_name === r.venue_name));
    for (const field of ['status','event_type','equipment_provided','pricing_review_status','venue_size']) assert.ok(d.metadata.allowed_values[field].includes(r[field]));
    assert.ok(r.performance_details.trim().length >= d.metadata.validation.performance_details_min_length);
    assert.ok(r.budget_min >= 0 && r.budget_max >= r.budget_min && r.duration_hours > 0);
    assert.equal(r.sent_at === null, r.status === 'Draft');
    assert.ok(Date.parse(r.created_at) <= Date.parse(r.stage_entered_at));
    assert.equal(r.days_in_stage, Math.floor((Date.parse(d.metadata.as_of) - Date.parse(r.stage_entered_at)) / 86400000));
    assert.equal(r.events[0].type, 'created');
    let last = -Infinity;
    for (const e of r.events) {
      assert.ok(d.metadata.allowed_values.event_kind.includes(e.type));
      assert.ok(Date.parse(e.at) >= last && Date.parse(e.at) <= Date.parse(d.metadata.as_of)); last = Date.parse(e.at);
      if (e.type === 'proposal_sent') assert.ok(d.metadata.allowed_values.clarity_level.includes(e.clarity_level));
    }
    const firstResponse = r.events.find(e => d.metadata.kpis.response_rate.response_event_types.includes(e.type));
    assert.equal(firstResponse?.at || null, r.first_entertainer_action_at);
  }
  assert.deepEqual(new Set(d.items.map(r => r.status)), new Set(d.metadata.allowed_values.status));
  for (const p of d.entertainers) {
    assert.equal(p.avatar.kind, 'initials'); assert.ok(p.avatar.text && p.bio && p.booking_notes.length);
    assert.ok(p.reviews.every(r => r.rating >= 1 && r.rating <= 5 && r.author && r.text));
  }
});
test('source sample descriptions and exact brief KPI definitions stay aligned', () => {
  const model = fs.readFileSync(path.join(root, '_initial_context-gigiii/data_model.md'), 'utf8');
  for (const line of model.split('\n').filter(l => l.startsWith('| REQ-'))) {
    const cells = line.slice(1,-1).split('|').map(c => c.trim());
    assert.equal(cells.length, 11);
    assert.equal(fixture.items.find(r => r.request_id === cells[0]).performance_details, cells[10]);
    assert.ok(cells[10].length >= 20);
  }
  for (const k of Object.values(fixture.metadata.kpis)) assert.ok(brief.includes(`**${k.label}:** ${k.definition}`), k.label);
});
test('KPI baseline, drafts, empty cohort, exact even median and inclusive window', () => {
  const r = runtime();
  assert.deepEqual(r.read("responseMetrics('ENT-001')"), { received:4, responded:2, rate:.5, median:3 });
  assert.equal(r.read("responseMetrics('ENT-021').rate"), null);
  r.run(`state.data.items = [1,2,9,14].map(h => ({entertainer_id:'median',sent_at:'2026-09-14T00:00:00Z',first_entertainer_action_at:new Date(Date.parse('2026-09-14T00:00:00Z')+h*3600000).toISOString(),first_entertainer_action_status:'Viewed'}));`);
  assert.equal(r.read("responseMetrics('median').median"), 5.5);
  r.run(`state.data.items.push({entertainer_id:'median',sent_at:'2026-06-18T12:00:00Z'},{entertainer_id:'median',sent_at:'2026-06-18T11:59:59Z'},{entertainer_id:'median',sent_at:'2026-09-17T00:00:00Z'},{entertainer_id:'median',sent_at:null});`);
  assert.equal(r.read("responseMetrics('median').received"), 5);
  assert.equal(r.read("responseMetrics('median').rate"), .8);
});
test('proposal analytics distinguish pending proposals, direct outcomes and frozen clarity', () => {
  const r = runtime();
  const at = '2026-09-01T00:00:00Z';
  r.run(`state.data.items = [
    {events:[{type:'accepted',at:'${at}'}]},
    {events:[{type:'declined',at:'${at}'}]},
    {events:[{type:'proposal_sent',at:'${at}',clarity_level:'Clear'}]},
    {pricing_review_status:'Reviewed',events:[{type:'proposal_sent',at:'${at}',clarity_level:'Needs Clarification'},{type:'accepted',at:'2026-09-02T00:00:00Z'}]},
    {events:[{type:'proposal_sent',at:'2026-05-01T00:00:00Z',clarity_level:'Clear'},{type:'proposal_sent',at:'${at}',clarity_level:'Clear'},{type:'accepted',at:'2026-09-03T00:00:00Z'}]}
  ].map(r=>({...r,status:'Accepted',stage_entered_at:'${at}'}));`);
  assert.deepEqual(r.read('pricingInsights().groups'), [
    {level:'Clear', proposals:1, accepted:0, rate:0},
    {level:'Needs Clarification', proposals:1, accepted:1, rate:1}
  ]);
  r.run('state.data.items = []');
  assert.equal(r.read('pricingInsights().groups[0].rate'), null);
});
test('equipment capabilities, unknown equipment and review precedence', () => {
  const r = runtime();
  r.run("const request = { ...state.data.items[1], pricing_review_status:'Reviewed', equipment_provided:'Full PA System' };");
  assert.equal(r.read('pricingMatch(request,state.data.entertainers[1]).tone'), 'positive');
  r.run("request.equipment_provided = 'Unclear'");
  assert.equal(r.read('pricingMatch(request,state.data.entertainers[1]).tone'), 'warning');
  r.run("request.equipment_provided = 'Nothing Provided'");
  assert.equal(r.read('pricingMatch(request,state.data.entertainers[1]).tone'), 'critical');
  r.run("request.pricing_review_status = 'Needs Clarification'");
  assert.match(r.read('pricingMatch(request,state.data.entertainers[1]).text'), /review needs clarification/);
});
test('strict stage threshold and first-response overdue policy exclude terminal records', () => {
  const r = runtime();
  r.run("const request = {status:'Sent',stage_entered_at:'2026-09-02T12:00:00Z',sent_at:'2026-09-01T00:00:00Z',response_due:'2026-09-06T00:00:00Z',first_entertainer_action_at:null};");
  assert.equal(r.read('isStuck(request)'), false);
  assert.equal(r.read('Boolean(isOverdue(request))'), true);
  r.run("request.stage_entered_at = '2026-09-01T12:00:00Z'; request.first_entertainer_action_at = '2026-09-01T06:00:00Z';");
  assert.equal(r.read('isStuck(request)'), true);
  assert.equal(r.read('Boolean(isOverdue(request))'), false);
  r.run("request.status = 'Accepted'");
  assert.equal(r.read('isStuck(request)'), false);
});
test('actual proposal/accept/undo handlers update events and recompute analytics', () => {
  const r = runtime();
  const before = r.read('pricingInsights().groups');
  r.click('propose');
  assert.equal(r.read('currentRequest().status'), 'Proposal Sent');
  assert.equal(r.read('currentRequest().pricing_review_status'), 'Reviewed');
  assert.equal(r.read('currentRequest().days_in_stage'), 0);
  assert.equal(r.read('currentRequest().events.at(-1).type'), 'proposal_sent');
  assert.equal(r.read('pricingInsights().groups[0].proposals'), before[0].proposals + 1);
  const firstResponse = r.read('currentRequest().first_entertainer_action_at');
  r.click('accept');
  assert.equal(r.read('pricingInsights().groups[0].accepted'), before[0].accepted + 1);
  assert.equal(r.read('currentRequest().first_entertainer_action_at'), firstResponse);
  r.click('undo');
  assert.equal(r.read('currentRequest().status'), 'Proposal Sent');
  assert.equal(r.read('pricingInsights().groups[0].accepted'), before[0].accepted);
  assert.equal(r.read('currentRequest().events.at(-1).type'), 'proposal_sent');
});
test('actual form submit validates duplicate then sets deadline and event history', () => {
  const r = runtime();
  r.run("state.form = {...state.data.items[0]}; delete state.form.request_id;");
  r.run('sendRequest({preventDefault(){}})');
  assert.match(r.element('form-feedback').textContent, /already have a request/);
  assert.equal(r.read('state.data.items.length'),32);
  r.run("state.form.event_date = '2026-12-29'; sendRequest({preventDefault(){}});");
  assert.equal(r.read('state.data.items.length'),33);
  assert.equal(r.read('currentRequest().events.at(-1).type'), 'sent');
  assert.equal(r.read('(Date.parse(currentRequest().response_due)-Date.parse(currentRequest().sent_at))/86400000'),5);
  r.click('undo');
  assert.equal(r.read('state.data.items.length'),32);
});
test('shared event filter scopes profiles, requests and KPI cohorts together', () => {
  const r = runtime();
  r.run("state.filters.event_type = 'Comedy Show'");
  assert.ok(r.read('filteredRequests().every(r=>r.event_type===state.filters.event_type)'));
  assert.ok(r.read('filteredProfiles().every(p=>p.event_types.includes(state.filters.event_type))'));
  assert.equal(r.read('pricingInsights().received'),fixture.items.filter(r=>r.event_type==='Comedy Show' && r.sent_at).length);
  assert.equal(r.read("responseMetrics('ENT-001').rate"),null);
});

test('clarification writes a response, flagged fields, note and reversible event', () => {
  const r = runtime();
  const before = r.read('currentRequest().events.length');
  r.run("clarify({preventDefault(){}, target:{fields:['equipment_provided'], message:'Please confirm the sound system.'}})");
  assert.equal(r.read('currentRequest().status'), 'In Discussion');
  assert.equal(r.read('currentRequest().pricing_review_status'), 'Needs Clarification');
  assert.equal(r.read('currentRequest().events.at(-1).type'), 'clarification_requested');
  assert.deepEqual(r.read('currentRequest().system_notes.at(-1).fields'), ['equipment_provided']);
  assert.equal(r.read('Boolean(isOverdue(currentRequest()))'), false);
  r.click('undo');
  assert.equal(r.read('currentRequest().status'), 'Sent');
  assert.equal(r.read('currentRequest().events.length'), before);
});

test('a later review appends history without changing first-response timing', () => {
  const r = runtime();
  r.run("state.selectedItem = 'REQ-002'");
  const timestamp = r.read('currentRequest().first_entertainer_action_at');
  const count = r.read('currentRequest().events.length');
  r.click('review');
  assert.equal(r.read('currentRequest().events.length'),count + 1);
  assert.equal(r.read('currentRequest().events.at(-1).type'),'reviewed');
  assert.equal(r.read('currentRequest().first_entertainer_action_at'),timestamp);
  assert.equal(r.read('currentRequest().pricing_review_status'),'Reviewed');
});
