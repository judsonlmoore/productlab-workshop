'use strict';

let state = { filters: { search: '', event_type: null }, data: null, selectedItem: null, selectedProfile: null, venueId: null, view: 'profiles', compare: [], form: null, dialog: null, feedback: '', undo: null };
const bootTime = Date.now();
const app = document.getElementById('app');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const label = field => field.replaceAll('_', ' ').replace(/^./, c => c.toUpperCase());
const metadata = () => state.data.metadata;
const values = field => metadata().allowed_values[field];
const statusValue = value => values('status').find(s => s === value);
const reviewValue = value => values('pricing_review_status').find(s => s === value);
const now = () => new Date(new Date(metadata().as_of).getTime() + Date.now() - bootTime);
const stamp = () => now().toISOString();
const currentProfile = () => state.data.entertainers.find(p => p.entertainer_id === state.selectedProfile);
const currentVenue = () => state.data.venues.find(v => v.venue_id === state.venueId);
const currentRequest = () => filteredRequests().find(r => r.request_id === state.selectedItem);
const money = n => Number.isFinite(Number(n)) && n !== null ? new Intl.NumberFormat('en-IE', { style: 'currency', currency: metadata().currency, maximumFractionDigits: 0 }).format(n) : 'Not provided';
const range = (a, b) => a === b ? money(a) : `${money(a)}–${money(b)}`;
const date = value => value ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value)) : 'Not set';
const hours = value => `${Number(value.toFixed(1))} h`;
const icon = name => `<i class="iconoir-${name}" aria-hidden="true"></i>`;
const button = (action, text, klass = 'btn-secondary', extra = '') => `<button type="button" class="${klass}" data-action="${action}" ${extra}>${text}</button>`;
const signal = (text, tone = 'neutral', diamond = false) => `<span class="signal ${tone}">${diamond ? `<span class="indicator-diamond-wrap"><span class="indicator-diamond ${tone}"></span></span>` : `<span class="indicator-circle ${tone}"></span>`}<span class="signal-text">${esc(text)}</span></span>`;
const badge = value => `<span class="badge"><span class="indicator-square ${value === statusValue('Accepted') ? 'positive' : value === reviewValue('Needs Clarification') ? 'warning' : 'neutral'}"></span>${esc(value)}</span>`;
const options = (list, selected) => list.map(v => `<option value="${esc(v)}" ${v === selected ? 'selected' : ''}>${esc(v)}</option>`).join('');
const detail = (field, value) => `<div><dt>${esc(label(field))}</dt><dd>${esc(value)}</dd></div>`;
const empty = text => `<div class="empty-state"><h2 class="empty-state-title">Nothing here yet</h2><p class="empty-state-body">${esc(text)}</p></div>`;

function filteredRequests() {
  return state.data.items.filter(r => !state.filters.event_type || r.event_type === state.filters.event_type);
}
function filteredProfiles() {
  return state.data.entertainers.filter(p => !state.filters.event_type || p.event_types.includes(state.filters.event_type));
}
function isActive(r) { return metadata().lifecycle.active_values.includes(r.status); }
function stageAge(r) { return Math.max(0, Math.floor((now() - Date.parse(r.stage_entered_at)) / 86400000)); }
function isStuck(r) { return isActive(r) && stageAge(r) > metadata().thresholds.stuck_days_in_stage; }
function isOverdue(r) { return isActive(r) && r.sent_at && !r.first_entertainer_action_at && r.response_due && Date.parse(r.response_due) < now().getTime(); }
function clarityLevel(r) {
  return r.equipment_provided === metadata().thresholds.equipment_warning.equals || !(r.duration_hours > 0) || r.pricing_review_status === reviewValue('Needs Clarification') ? values('clarity_level')[1] : values('clarity_level')[0];
}
function recordEvent(r, type, extra = {}) {
  r.events ??= [];
  r.events.push({ type, at: stamp(), ...extra });
}
function responseMetrics(entertainerId = null) {
  const definition = metadata().kpis.response_rate;
  const end = now().getTime();
  const start = end - definition.window_days * 86400000;
  const received = filteredRequests().filter(r => (!entertainerId || r.entertainer_id === entertainerId) && r.sent_at && Date.parse(r[definition.cohort_field]) >= start && Date.parse(r[definition.cohort_field]) <= end);
  const responded = received.filter(r => r.first_entertainer_action_at && ['Viewed', 'In Discussion'].includes(r.first_entertainer_action_status) && Date.parse(r.first_entertainer_action_at) <= end && Date.parse(r.first_entertainer_action_at) >= Date.parse(r.sent_at));
  const times = responded.map(r => (Date.parse(r.first_entertainer_action_at) - Date.parse(r.sent_at)) / 3600000).sort((a, b) => a - b);
  const middle = Math.floor(times.length / 2);
  return { received: received.length, responded: responded.length, rate: received.length ? responded.length / received.length : null, median: times.length ? (times[middle] + times[Math.floor((times.length - 1) / 2)]) / 2 : null };
}
function metricsHTML(profile) {
  const metric = responseMetrics(profile.entertainer_id);
  return `<div class="metrics"><div title="${esc(metadata().kpis.response_rate.definition)}"><p class="meta">${esc(metadata().kpis.response_rate.label)}</p><p class="metric-value">${metric.rate === null ? '—' : `${Math.round(metric.rate * 100)}%`}</p></div><div title="${esc(metadata().kpis.average_response_time.definition)}"><p class="meta">${esc(metadata().kpis.average_response_time.label)}</p><p class="metric-value">${metric.median === null ? '—' : hours(metric.median)}</p><p class="meta">Median · ${metadata().kpis.average_response_time.window_days} days</p></div><div><p class="meta">Responses / received</p><p class="metric-value">${metric.responded} / ${metric.received}</p><p class="meta">Last ${metadata().kpis.response_rate.window_days} days</p></div></div>`;
}
function completePricing(p) {
  return p && Number.isFinite(p.base_rate_min) && Number.isFinite(p.base_rate_max) && p.typical_duration_hours > 0 && Array.isArray(p.equipment_included) && Array.isArray(p.equipment_required_from_venue);
}
function pricingMatch(request, profile) {
  if (request.pricing_review_status === reviewValue('Needs Clarification')) return { tone: 'warning', text: 'Pricing review needs clarification. Check the entertainer’s questions below.' };
  const p = profile?.pricing;
  if (!completePricing(p)) return { tone: 'neutral', text: 'Pricing details not provided. Ask before booking.' };
  if (request.equipment_provided === metadata().thresholds.equipment_warning.equals || !request.duration_hours) return { tone: 'warning', text: metadata().thresholds.missing_request_details.message };
  if (p.equipment_required_from_venue.some(required => !(metadata().equipment_capabilities[request.equipment_provided] || []).includes(required))) return { tone: 'critical', text: `Equipment mismatch: requires ${p.equipment_required_from_venue.join(', ')}; venue provides ${request.equipment_provided}.` };
  if (request.budget_max + 0.01 < p.base_rate_min * request.duration_hours) return { tone: 'warning', text: 'Budget below your typical range for this duration.' };
  return { tone: 'positive', text: request.duration_hours === p.typical_duration_hours ? `Matches your ${p.typical_duration_hours}-hour standard rate` : `Budget and equipment match this ${request.duration_hours}-hour performance` };
}
function availability(profile, targetDate) {
  if (!targetDate) return 'Choose an event date';
  const booked = state.data.items.some(r => r.entertainer_id === profile.entertainer_id && r.event_date === targetDate && r.status === statusValue('Accepted'));
  return booked ? 'Booked' : profile.availability?.find(a => a.event_date === targetDate)?.status || 'Availability not confirmed';
}
function collectionHTML() {
  if (state.view === 'requests') {
    return `<aside class="collection" aria-label="Request selection"><div class="collection-heading"><h2>Requests <span class="badge">${filteredRequests().length}</span></h2><p class="meta">Select a request to review pricing.</p></div><div class="collection-list">${values('status').map(status => {
      const items = filteredRequests().filter(r => r.status === status);
      return `<section><h3 class="request-list-heading meta">${esc(status)} · ${items.length}</h3>${items.map(r => `<div class="collection-item ${r.request_id === state.selectedItem ? 'selected' : ''}"><button data-request="${esc(r.request_id)}" aria-current="${r.request_id === state.selectedItem ? 'true' : 'false'}"><span class="collection-title">${esc(r.venue_name)}</span><span class="collection-subtitle">${esc(r.entertainer_name)}</span><span class="meta">${esc(r.request_id)} · ${date(r.event_date)}</span></button></div>`).join('')}</section>`;
    }).join('')}</div><div class="collection-footer meta">Changes appear immediately in request details.</div></aside>`;
  }
  const profiles = filteredProfiles().filter(p => `${p.entertainer_name} ${p.event_types.join(' ')}`.toLowerCase().includes(state.filters.search.toLowerCase()));
  return `<aside class="collection" aria-label="Entertainer selection"><div class="collection-heading"><h2>Entertainers <span class="badge">${profiles.length}</span></h2><label class="sr-only" for="search">Search entertainers</label><input class="form-input" id="search" type="search" placeholder="Search entertainers" value="${esc(state.filters.search)}"></div><div class="collection-list">${profiles.map(p => `<div class="collection-item ${p.entertainer_id === state.selectedProfile ? 'selected' : ''}"><button data-profile="${esc(p.entertainer_id)}" aria-current="${p.entertainer_id === state.selectedProfile ? 'true' : 'false'}"><span class="collection-title">${esc(p.entertainer_name)}</span><span class="collection-subtitle">${esc(p.event_types.join(' · '))}</span></button><label title="Compare ${esc(p.entertainer_name)}"><input type="checkbox" data-compare="${esc(p.entertainer_id)}" aria-label="Compare ${esc(p.entertainer_name)}" ${state.compare.includes(p.entertainer_id) ? 'checked' : ''} ${state.compare.length >= 3 && !state.compare.includes(p.entertainer_id) ? 'disabled' : ''}></label></div>`).join('') || empty('No entertainers match your search.')}</div><div class="collection-footer">${button('compare', `Compare pricing (${state.compare.length})`, 'btn-secondary', state.compare.length < 2 ? 'disabled' : '')}<p class="subtitle meta">Select two or three entertainers.</p></div></aside>`;
}
function profileHTML(profile) {
  if (!profile) return empty('No entertainers match your search. Try another name or event type.');
  const p = profile.pricing;
  const initials = profile.avatar.text;
  const v = currentVenue();
  const requests = state.data.items.filter(r => r.entertainer_id === profile.entertainer_id && r.venue_id === v.venue_id);
  const items = entries => entries.map(x => `<li>${esc(x)}</li>`).join('');
  return `<article class="profile-layout enter"><header class="profile-heading"><div class="avatar" aria-hidden="true">${esc(initials)}</div><div><p class="eyebrow">ENTERTAINER PROFILE</p><h1>${esc(profile.entertainer_name)}</h1><p class="subtitle">${esc(profile.event_types.join(' · '))}</p></div></header><section class="pricing-card" aria-labelledby="pricing-heading"><h2 id="pricing-heading">Pricing & Booking Details</h2>${completePricing(p) ? `<div class="pricing-top"><div><p class="meta">What you pay · per performance</p><p class="price">${range(p.base_rate_min * p.typical_duration_hours, p.base_rate_max * p.typical_duration_hours)}</p><p class="subtitle">${range(p.base_rate_min, p.base_rate_max)} / hour</p></div><div><p class="meta">Typical duration</p><p class="price">${esc(p.typical_duration_hours)}-hour sets</p><p class="subtitle">${esc(p.setup_time_minutes)} min setup${p.setup_included ? ' included' : ''}</p></div></div><div class="equipment-grid"><div><h3>${signal("What's included", 'positive')}</h3><ul class="equipment-list">${items(p.equipment_included)}</ul></div><div><h3>${signal('What you provide', 'neutral', true)}</h3><ul class="equipment-list">${items([...p.equipment_required_from_venue, ...p.venue_requirements])}</ul></div></div><div><p class="meta">Not included</p><p>${esc(p.not_included.join(' · '))}</p></div><div><p class="meta">Load-in & setup</p><p>${esc(p.load_in_expectations)}</p></div><details class="disclosure"><summary>View Example Pricing</summary>${p.example_scenarios.map(s => `<div class="scenario"><p>${esc(s.description)}<br><span class="meta">Venue: ${esc(s.equipment_provided)}</span></p><span class="table-cell-primary">${range(s.budget_min, s.budget_max)}</span></div>`).join('')}</details>` : `<p>${esc(metadata().thresholds.missing_profile_pricing.message)}</p>`}<div class="booking-footer"><div><p class="meta">Booking for ${esc(v.venue_name)}</p><p>${esc(v.equipment_provided)}</p>${v.equipment_provided === metadata().thresholds.equipment_warning.equals ? signal(metadata().thresholds.equipment_warning.message, 'critical', true) : ''}</div>${button('new-request', `${!completePricing(p) ? icon('warning-triangle') + ' ' : ''}Send Request ${icon('arrow-right')}`, 'btn-primary')}</div></section><section aria-label="Response history">${metricsHTML(profile)}</section><details class="disclosure"><summary>About, reviews & booking notes</summary><p class="subtitle">${esc(profile.bio)}</p><h3 class="subtitle">Sample reviews · ${profile.reviews.length ? (profile.reviews.reduce((sum, r) => sum + r.rating, 0) / profile.reviews.length).toFixed(1) : '—'} / 5</h3>${profile.reviews.map(r => `<blockquote class="review-notes"><p>${esc(r.text)}</p><p class="meta">${esc(r.author)} · ${r.rating}/5 · ${date(r.date)}</p></blockquote>`).join('')}<h3 class="subtitle">Booking notes</h3><ul class="equipment-list">${items(profile.booking_notes)}</ul></details>${requests.length ? `<details class="disclosure"><summary>Your requests with ${esc(profile.entertainer_name)} (${requests.length})</summary>${requests.map(r => `<div class="scenario"><span>${date(r.event_date)} · ${esc(r.status)} · ${esc(r.pricing_review_status)}</span>${button('open-request', 'View request', 'link-button', `data-id="${esc(r.request_id)}"`)}</div>`).join('')}</details>` : ''}</article>`;
}
function requestHTML(r) {
  if (!r) return empty('Send a request from an entertainer profile to get started.');
  const profile = state.data.entertainers.find(p => p.entertainer_id === r.entertainer_id);
  const match = pricingMatch(r, profile);
  const active = isActive(r);
  const stuck = isStuck(r);
  const overdue = isOverdue(r);
  return `<article class="request-layout enter"><header><div class="actions"><p class="eyebrow">${esc(r.request_id)}</p>${badge(r.status)}</div><h1>${esc(r.venue_name)} → ${esc(r.entertainer_name)}</h1><p class="subtitle">${esc(r.event_type)} · ${date(r.event_date)}</p></header><section class="pricing-card"><h2>Budget & Requirements</h2>${signal(match.text, match.tone, match.tone !== 'positive')}<div class="pricing-top"><div><p class="meta">Venue budget</p><p class="price">${range(r.budget_min, r.budget_max)}</p></div><div><p class="meta">Performance duration</p><p class="price">${esc(r.duration_hours ?? 'Not set')} hours</p></div></div><dl class="detail-grid">${detail('equipment_provided', r.equipment_provided)}${detail('load_in_time', r.load_in_time || 'Not set')}<div class="full-width"><dt>${label('performance_details')}</dt><dd>${esc(r.performance_details)}</dd></div></dl><div class="booking-footer"><div><p class="meta">${esc(r.venue_name)} · ${esc(r.venue_size)}</p>${button('venue-profile', 'View venue profile', 'link-button')}</div>${button('show-profile', 'View entertainer profile', 'btn-secondary', `data-id="${esc(r.entertainer_id)}"`)}</div></section><section><h2>Entertainer review</h2><div class="actions subtitle">${badge(r.pricing_review_status)}${active && r.status !== statusValue('Draft') ? `${button('review', 'Mark Reviewed')}${button('clarify', 'Request Clarification')}${r.status !== statusValue('Proposal Sent') ? button('propose', 'Send Proposal') : ''}${button('accept', 'Accept', 'btn-primary')}${button('decline', 'Decline')}` : r.status === statusValue('Draft') ? button('edit-draft', 'Complete & send request', 'btn-primary') : ''}</div>${r.status === statusValue('Sent') ? `<p class="subtitle">Awaiting response. ${responseMetrics(r.entertainer_id).median === null ? 'Response time not available yet.' : `Typically responds within ${hours(responseMetrics(r.entertainer_id).median)}.`}</p>` : ''}${r.system_notes.length ? `<div class="review-notes">${r.system_notes.map(n => `<p class="note">${esc(n.text)}${n.fields?.length ? ` · Fields: ${esc(n.fields.map(label).join(', '))}` : ''}${n.message ? ` · ${esc(n.message)}` : ''}</p>`).join('')}</div>` : ''}</section><details class="disclosure"><summary>Timeline & response history ${overdue ? '· Response overdue' : ''}</summary><dl class="detail-grid subtitle">${detail('created_at', date(r.created_at))}${detail('sent_at', date(r.sent_at))}${detail('response_due', date(r.response_due))}<div><dt>${label('days_in_stage')}</dt><dd class="${stuck ? 'value-critical' : ''}">${stageAge(r)}${stuck ? ' · Needs attention' : ''}</dd></div></dl>${bookingComparisonHTML(r)}${metricsHTML(profile)}<div class="review-notes"><h3>Request history</h3>${r.events.map(e => `<p class="note">${esc(label(e.type))} · ${date(e.at)}${e.clarity_level ? ` · ${esc(e.clarity_level)}` : ''}</p>`).join('')}</div></details></article>`;
}
function bookingComparisonHTML(request) {
  const past = state.data.items.filter(r => r.entertainer_id === request.entertainer_id && r.status === statusValue('Accepted') && Date.parse(r.event_date) <= now() && r.budget_min <= request.budget_max && r.budget_max >= request.budget_min);
  if (!past.length) return '<p class="subtitle meta">No completed bookings in a similar budget range yet.</p>';
  const durations = past.map(r => r.duration_hours);
  return `<p class="subtitle meta">Venues with overlapping budgets previously booked ${Math.min(...durations)}–${Math.max(...durations)} hours (${past.length} completed bookings).</p>`;
}
function pricingInsights() {
  const end = now().getTime();
  const start = end - metadata().kpis.proposal_acceptance_rate.window_days * 86400000;
  const requests = filteredRequests();
  const received = requests.filter(r => r.sent_at && Date.parse(r.sent_at) >= start && Date.parse(r.sent_at) <= end);
  const unclear = received.filter(r => clarityLevel(r) === values('clarity_level')[1]).length;
  const proposals = requests.flatMap(r => {
    const index = r.events.findIndex(e => e.type === 'proposal_sent');
    const first = r.events[index];
    if (!first || Date.parse(first.at) < start || Date.parse(first.at) > end) return [];
    const accepted = r.events.slice(index + 1).some(e => e.type === 'accepted' && Date.parse(e.at) >= Date.parse(first.at) && Date.parse(e.at) <= end);
    return [{ clarity: first.clarity_level, accepted }];
  });
  return { ...responseMetrics(), unclear, clarificationRate: received.length ? unclear / received.length : null,
    groups: values('clarity_level').map(level => { const group = proposals.filter(p => p.clarity === level); const accepted = group.filter(p => p.accepted).length; return { level, proposals: group.length, accepted, rate: group.length ? accepted / group.length : null }; }),
    stuck: requests.filter(isStuck).length, overdue: requests.filter(isOverdue).length };
}
function insightsHTML() {
  const metrics = pricingInsights();
  const percent = n => n === null ? '—' : `${Math.round(n * 100)}%`;
  const metric = (title, value, context) => `<section><p class="meta">${esc(title)}</p><p class="metric-value">${esc(value)}</p><p class="meta">${esc(context)}</p></section>`;
  return `<section class="insights-layout enter"><header><p class="eyebrow">PRICING CLARITY</p><h1>${esc(metadata().ui.insights_tab)}</h1><p class="subtitle">Last ${metadata().kpis.response_rate.window_days} days · ${state.filters.event_type ? esc(state.filters.event_type) : 'All event types'}</p></header><div class="insights-metrics">${metric(metadata().kpis.response_rate.label, percent(metrics.rate), `${metrics.responded} responses / ${metrics.received} received`)}${metric(metadata().kpis.average_response_time.label, metrics.median === null ? '—' : hours(metrics.median), 'Explicit responses only')}${metric(metadata().kpis.clarification_rate.label, percent(metrics.clarificationRate), `${metrics.unclear} / ${metrics.received} received requests`)}</div><section><h2>${esc(metadata().kpis.proposal_acceptance_rate.label)} by pricing clarity</h2><p class="subtitle">Clarity is captured when the first proposal is sent.</p><table class="insights-table"><thead><tr><th scope="col">Pricing clarity</th><th scope="col">Accepted</th><th scope="col">Proposals</th><th scope="col">Acceptance</th></tr></thead><tbody>${metrics.groups.map(g => `<tr><th scope="row">${esc(g.level)}</th><td>${g.accepted}</td><td>${g.proposals}</td><td>${percent(g.rate)}</td></tr>`).join('')}</tbody></table><p class="meta subtitle">Pending proposals count in the denominator. Direct acceptance without a proposal is excluded.</p></section><section class="insights-metrics">${metric('Stuck requests', metrics.stuck, `Active for more than ${metadata().thresholds.stuck_days_in_stage} days in stage`)}${metric('Overdue responses', metrics.overdue, `No first response by the ${metadata().thresholds.response_due_days}-day deadline`)}</section><details class="disclosure"><summary>Metric definitions & workshop clock</summary>${Object.values(metadata().kpis).map(k => `<p class="subtitle"><strong>${esc(k.label)}:</strong> ${esc(k.definition)}</p>`).join('')}<p class="subtitle">This fictional dataset starts at ${date(metadata().as_of)}. Time advances during the session; refreshing resets data and the clock.</p></details></section>`;
}
function comparisonHTML() {
  const selected = state.compare.map(id => state.data.entertainers.find(p => p.entertainer_id === id));
  const draft = state.form || state.data.items.find(r => r.venue_id === state.venueId && r.status === statusValue('Draft'));
  const context = draft || metadata().defaults.comparison;
  const h = Number(context.duration_hours) || metadata().defaults.comparison.duration_hours;
  const row = (title, fn) => `<tr><th scope="row" class="meta">${esc(title)}</th>${selected.map(p => `<td>${fn(p)}</td>`).join('')}</tr>`;
  return `<section class="comparison enter"><div class="dialog-heading"><div><p class="eyebrow">SIDE BY SIDE</p><h1>Compare Pricing</h1><p class="subtitle">${h} hours · ${esc(context.equipment_provided)}${context.event_date ? ` · ${date(context.event_date)}` : ''}</p></div>${button('back', 'Back to profiles')}</div><table><thead><tr><th scope="col" class="meta">Pricing & requirements</th>${selected.map(p => `<th scope="col">${button('show-profile', esc(p.entertainer_name), 'link-button', `data-id="${esc(p.entertainer_id)}"`)}</th>`).join('')}</tr></thead><tbody>${row('Base rate / hour', p => completePricing(p.pricing) ? range(p.pricing.base_rate_min, p.pricing.base_rate_max) : 'Not provided')}${row('Typical duration', p => completePricing(p.pricing) ? `${p.pricing.typical_duration_hours} hours` : 'Not provided')}${row('Your cost estimate', p => completePricing(p.pricing) ? `<span class="price">${range(p.pricing.base_rate_min * h, p.pricing.base_rate_max * h)}</span>` : 'Ask for rates')}${row("What's included", p => esc(p.pricing?.equipment_included.join(', ') || 'Not provided'))}${row('What you provide', p => esc(p.pricing ? [...p.pricing.equipment_required_from_venue, ...p.pricing.venue_requirements].join(', ') : 'Not provided'))}${row('Equipment fit', p => { const match = pricingMatch({ ...context, duration_hours: h, budget_max: Infinity }, p); return signal(match.tone === 'positive' ? 'Equipment requirements met' : match.text, match.tone, true); })}${row('Availability', p => esc(availability(p, context.event_date)))}</tbody></table><p class="subtitle meta">Estimates use published hourly rates. Equipment requirements still apply.</p></section>`;
}
function input(field, type = 'text', extra = '') {
  return `<div class="form-group"><label class="form-label" for="${field}">${esc(label(field))}</label><input class="form-input" id="${field}" name="${field}" type="${type}" value="${esc(state.form[field])}" ${extra}></div>`;
}
function selectField(field, list) {
  return `<div class="form-group"><label class="form-label" for="${field}">${esc(label(field))}</label><select class="form-select" id="${field}" name="${field}">${options(list, state.form[field])}</select></div>`;
}
function requestDialogHTML() {
  const minimum = metadata().validation.performance_details_min_length;
  return `<dialog id="active-dialog" aria-labelledby="dialog-title"><div class="dialog-heading"><div><h2 id="dialog-title">Send a booking request</h2><p>${esc(state.form.entertainer_name)} · ${esc(state.form.venue_name)}</p></div>${button('close-dialog', 'Close')}</div><form id="request-form"><div class="form-grid">${input('event_date', 'date', 'required')}${input('duration_hours', 'number', 'required min="0.25" step="0.25"')}${selectField('event_type', values('event_type'))}${selectField('equipment_provided', values('equipment_provided'))}${input('budget_min', 'number', 'required min="0" step="0.01"')}${input('budget_max', 'number', 'required min="0" step="0.01"')}<div class="full-width"><p id="budget-suggestion" class="meta" aria-live="polite"></p><p id="equipment-warning" class="meta" aria-live="polite"></p></div><div class="form-group full-width"><label class="form-label" for="performance_details">${label('performance_details')}</label><textarea class="form-input" id="performance_details" name="performance_details" required minlength="${minimum}">${esc(state.form.performance_details)}</textarea><p class="meta">At least ${minimum} characters. Describe the performance you have in mind.</p></div></div><p id="form-feedback" class="form-feedback critical" role="alert"></p><div class="actions form-actions">${button('close-dialog', 'Cancel')}<button class="btn-primary" type="submit">Send Request</button></div></form></dialog>`;
}
function clarificationDialogHTML() {
  const r = currentRequest();
  const fields = ['budget_min', 'budget_max', 'duration_hours', 'equipment_provided', 'performance_details'];
  return `<dialog id="active-dialog" aria-labelledby="dialog-title"><div class="dialog-heading"><h2 id="dialog-title">Request Clarification</h2>${button('close-dialog', 'Close')}</div><p>Tell ${esc(r.venue_name)} what you need to confirm.</p><form id="clarification-form"><fieldset class="pricing-card subtitle"><legend class="form-label">Fields that need clarification</legend>${fields.map(f => `<label class="signal"><input type="checkbox" name="fields" value="${esc(f)}" ${f === 'equipment_provided' ? 'checked' : ''}>${esc(label(f))}</label>`).join('')}</fieldset><label class="form-label subtitle" for="clarification-message">Message to venue</label><textarea class="form-input" id="clarification-message" name="message" required placeholder="What would help you prepare a proposal?"></textarea><p id="form-feedback" class="form-feedback critical" role="alert"></p><div class="actions form-actions">${button('close-dialog', 'Cancel')}<button class="btn-primary" type="submit">Request Clarification</button></div></form></dialog>`;
}
function venueDialogHTML() {
  const r = currentRequest();
  const venue = state.data.venues.find(v => v.venue_id === r.venue_id);
  const history = state.data.items.filter(i => i.venue_id === r.venue_id);
  const cutoff = new Date(now()); cutoff.setUTCMonth(cutoff.getUTCMonth() - 6);
  const past = history.filter(i => i.status === statusValue('Accepted') && Date.parse(i.event_date) <= now() && Date.parse(i.event_date) >= cutoff);
  const similar = history.filter(i => i.event_type === r.event_type && i.status === statusValue('Accepted') && Date.parse(i.event_date) <= now());
  return `<dialog id="active-dialog" class="drawer" aria-labelledby="dialog-title"><div class="dialog-heading"><h2 id="dialog-title">${esc(venue.venue_name)}</h2>${button('close-dialog', 'Close')}</div><dl class="detail-grid">${detail('venue_size', venue.venue_size)}${detail('equipment_provided', venue.equipment_provided)}${detail('typical_event_types', venue.typical_event_types.join(', '))}</dl><div class="review-notes"><h3>Past bookings</h3><p>${past.length} completed bookings in the past 6 months.</p><p>Average budget for ${esc(r.event_type)}: ${similar.length ? range(similar.reduce((n, i) => n + i.budget_min, 0) / similar.length, similar.reduce((n, i) => n + i.budget_max, 0) / similar.length) : 'No completed bookings yet'}</p>${history.map(i => `<p>${date(i.event_date)} · ${esc(i.entertainer_name)} · ${esc(i.status)}</p>`).join('')}</div></dialog>`;
}

function render() {
  const viewKey = `${state.view}:${state.view === 'requests' ? state.selectedItem : state.selectedProfile}`;
  const keepPosition = app.dataset.viewKey === viewKey;
  const scrollTop = keepPosition ? app.querySelector('.workspace')?.scrollTop || 0 : 0;
  const listScroll = keepPosition ? app.querySelector('.collection-list')?.scrollTop || 0 : 0;
  const expanded = keepPosition ? [...app.querySelectorAll('.workspace details[open]')].map(d => d.querySelector('summary')?.textContent.split(' · ')[0].trim()) : [];
  const focused = document.activeElement?.id;
  const selection = focused === 'search' ? document.activeElement.selectionStart : null;
  const dialog = document.getElementById('active-dialog');
  if (dialog?.open) dialog.close();
  document.getElementById('controls').innerHTML = `<label class="inline-field event-filter"><span class="meta">Event type</span><select id="event-filter" class="form-select" aria-label="Filter event type"><option value="">All event types</option>${options(metadata().filters.specifications.find(f => f.field === 'event_type').allowed_values, state.filters.event_type)}</select></label>` + (['requests', 'insights'].includes(state.view) ? '' : `<label class="inline-field"><span class="meta">Booking for</span><select id="venue-select" class="form-select" aria-label="Booking venue">${state.data.venues.map(v => `<option value="${esc(v.venue_id)}" ${state.venueId === v.venue_id ? 'selected' : ''}>${esc(v.venue_name)}</option>`).join('')}</select></label>`);
  document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-current', b.dataset.view === state.view ? 'page' : 'false'));
  app.innerHTML = `<div class="view-tabs"><div class="tab-group" role="tablist" aria-label="Feature views"><button id="workspace-tab" type="button" role="tab" aria-controls="feature-content" aria-selected="${state.view !== 'insights'}" tabindex="${state.view !== 'insights' ? '0' : '-1'}" class="${state.view !== 'insights' ? 'active' : ''}" data-view="profiles">${esc(metadata().ui.workspace_tab)}</button><button id="insights-tab" type="button" role="tab" aria-controls="feature-content" aria-selected="${state.view === 'insights'}" tabindex="${state.view === 'insights' ? '0' : '-1'}" class="${state.view === 'insights' ? 'active' : ''}" data-view="insights">${esc(metadata().ui.insights_tab)}</button></div></div><div id="feature-content" role="tabpanel" aria-labelledby="${state.view === 'insights' ? 'insights-tab' : 'workspace-tab'}">${state.view === 'insights' ? insightsHTML() : state.view === 'compare' ? comparisonHTML() : collectionHTML() + `<div class="workspace">${state.view === 'requests' ? requestHTML(currentRequest()) : profileHTML(currentProfile())}</div>`}</div>${state.feedback ? `<div class="notice" role="status"><span>${esc(state.feedback)}</span>${state.undo ? button('undo', 'Undo', 'link-button') : ''}${button('dismiss', 'Dismiss', 'link-button')}</div>` : ''}${state.dialog === 'request' ? requestDialogHTML() : state.dialog === 'clarification' ? clarificationDialogHTML() : state.dialog === 'venue' ? venueDialogHTML() : ''}`;
  app.removeAttribute('aria-busy');
  app.dataset.viewKey = viewKey;
  if (keepPosition) {
    app.querySelectorAll('.workspace details').forEach(d => { d.open = expanded.includes(d.querySelector('summary')?.textContent.split(' · ')[0].trim()); });
    const workspace = app.querySelector('.workspace'); if (workspace) workspace.scrollTop = scrollTop;
    const list = app.querySelector('.collection-list'); if (list) list.scrollTop = listScroll;
  }
  const activeDialog = document.getElementById('active-dialog');
  if (activeDialog) {
    activeDialog.showModal();
    activeDialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
    if (state.dialog === 'request') updateFormFeedback();
  } else if (focused && document.getElementById(focused)) {
    document.getElementById(focused).focus();
    if (selection !== null) document.getElementById(focused).setSelectionRange(selection, selection);
  }
}
function snapshotUndo() { state.undo = { items: structuredClone(state.data.items), selectedItem: state.selectedItem, view: state.view, filters: structuredClone(state.filters) }; }
function notify(text) { state.feedback = text; }
function transition(r, status) {
  if (r.status !== status) { r.status = status; r.stage_entered_at = stamp(); r.days_in_stage = 0; }
  r.last_activity = stamp();
}
function recordResponse(r, firstStatus) {
  if (!r.first_entertainer_action_at && r.sent_at) { r.first_entertainer_action_at = stamp(); r.first_entertainer_action_status = firstStatus; recordEvent(r, 'reviewed'); }
}
function updateItem(identifier, field, value) {
  const r = state.data.items.find(i => i[metadata().identifier_field] === identifier);
  if (!r) return;
  snapshotUndo();
  if (field === 'status') transition(r, value); else { r[field] = value; r.last_activity = stamp(); }
  render();
}
function closeDialog() {
  state.dialog = null;
  render();
  app.querySelector('[data-action="new-request"], [data-action="clarify"], [data-action="venue-profile"]')?.focus();
}
function openForm(existing) {
  const p = existing ? state.data.entertainers.find(p => p.entertainer_id === existing.entertainer_id) : currentProfile();
  const v = existing ? state.data.venues.find(v => v.venue_id === existing.venue_id) : currentVenue();
  state.selectedProfile = p.entertainer_id;
  state.form = existing ? { ...existing } : { venue_id: v.venue_id, venue_name: v.venue_name, entertainer_id: p.entertainer_id, entertainer_name: p.entertainer_name, venue_size: v.venue_size, event_date: '', event_type: state.filters.event_type || p.event_types[0], duration_hours: p.pricing?.typical_duration_hours ?? '', equipment_provided: v.equipment_provided || metadata().thresholds.equipment_warning.equals, budget_min: completePricing(p.pricing) ? Math.round(p.pricing.base_rate_min * p.pricing.typical_duration_hours) : '', budget_max: completePricing(p.pricing) ? Math.round(p.pricing.base_rate_max * p.pricing.typical_duration_hours) : '', performance_details: '' };
  state.dialog = 'request'; render();
  document.getElementById('event_date').focus();
}
function updateFormFeedback() {
  const p = currentProfile().pricing;
  const h = Number(state.form.duration_hours);
  document.getElementById('budget-suggestion').textContent = completePricing(p) && h > 0 ? `For ${h}-hour performances, this entertainer typically charges ${range(p.base_rate_min * h, p.base_rate_max * h)}.` : 'Ask the entertainer to confirm their rates.';
  document.getElementById('equipment-warning').textContent = state.form.equipment_provided === metadata().thresholds.equipment_warning.equals ? metadata().thresholds.equipment_warning.message : '';
}
function sendRequest(event) {
  event.preventDefault();
  const f = { ...state.form, duration_hours: Number(state.form.duration_hours), budget_min: Number(state.form.budget_min), budget_max: Number(state.form.budget_max), performance_details: state.form.performance_details.trim() };
  let error = '';
  if (f.performance_details.length < metadata().validation.performance_details_min_length) error = `Describe the performance in at least ${metadata().validation.performance_details_min_length} characters.`;
  else if (!Number.isFinite(f.duration_hours) || f.duration_hours <= 0 || !Number.isFinite(f.budget_min) || !Number.isFinite(f.budget_max) || f.budget_min < 0 || f.budget_max < f.budget_min) error = 'Enter a positive duration and a budget whose maximum is at least its minimum.';
  else if (!f.event_date || !values('event_type').includes(f.event_type)) error = 'Choose an event date and event type.';
  else if (state.data.items.some(r => r.request_id !== f.request_id && metadata().validation.duplicate_key.every(k => r[k] === f[k]))) error = 'You already have a request for this entertainer and event date. Open the existing request instead.';
  if (error) { document.getElementById('form-feedback').textContent = error; return; }
  snapshotUndo();
  let r = f.request_id && state.data.items.find(i => i.request_id === f.request_id);
  if (r) Object.assign(r, f);
  else { r = { ...f, request_id: `${metadata().entity.toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, created_at: stamp(), status: statusValue('Draft'), load_in_time: '', first_entertainer_action_at: null, first_entertainer_action_status: null, response_due: null, system_notes: [], events: [{ type: 'created', at: stamp() }], pricing_review_status: reviewValue('Pending') }; state.data.items.push(r); }
  r.sent_at = stamp(); r.response_due = new Date(Date.parse(r.sent_at) + metadata().thresholds.response_due_days * 86400000).toISOString(); recordEvent(r, 'sent'); transition(r, statusValue('Sent'));
  if (state.filters.event_type && state.filters.event_type !== r.event_type) state.filters.event_type = r.event_type;
  state.selectedItem = r.request_id; state.view = 'requests'; state.dialog = null; state.form = null;
  const metric = responseMetrics(r.entertainer_id);
  notify(`Request sent to ${r.entertainer_name}. ${metric.median === null ? 'Awaiting their response.' : `Typically responds within ${hours(metric.median)}.`}${f.equipment_provided === metadata().thresholds.equipment_warning.equals ? ' Equipment details still need clarification.' : ' Your duration and equipment details are included.'}`);
  render(); app.querySelector('[data-action="review"]')?.focus();
}
function clarify(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const fields = data.getAll('fields'); const message = String(data.get('message')).trim();
  if (!fields.length || !message) { document.getElementById('form-feedback').textContent = 'Select at least one field and describe what needs clarification.'; return; }
  snapshotUndo(); const r = currentRequest();
  recordResponse(r, statusValue('In Discussion')); transition(r, statusValue('In Discussion')); r.pricing_review_status = reviewValue('Needs Clarification');
  recordEvent(r, 'clarification_requested', { fields });
  r.system_notes.push({ created_at: stamp(), text: `Entertainer requested clarification on ${stamp()}`, fields, message });
  state.dialog = null; notify(`${r.venue_name}: entertainer has questions about your request. Clarification is visible in request details.`); render();
  app.querySelector('[data-action="review"]')?.focus();
}
document.addEventListener('click', event => {
  if (!state.data) return;
  const target = event.target.closest('button'); if (!target) return;
  if (target.dataset.view) { state.view = target.dataset.view; state.dialog = null; render(); if (target.getAttribute('role') === 'tab') document.getElementById(state.view === 'insights' ? 'insights-tab' : 'workspace-tab')?.focus(); return; }
  if (target.dataset.profile) { state.selectedProfile = target.dataset.profile; state.view = 'profiles'; render(); return; }
  if (target.dataset.request) { state.selectedItem = target.dataset.request; state.view = 'requests'; render(); return; }
  const action = target.dataset.action;
  if (action === 'new-request') return openForm();
  if (action === 'edit-draft') return openForm(currentRequest());
  if (action === 'close-dialog') return closeDialog();
  if (action === 'compare') { state.view = 'compare'; render(); }
  if (action === 'back') { state.view = 'profiles'; render(); }
  if (action === 'show-profile') { state.selectedProfile = target.dataset.id; state.view = 'profiles'; render(); }
  if (action === 'open-request') { state.selectedItem = target.dataset.id; state.view = 'requests'; render(); }
  if (action === 'venue-profile') { state.dialog = 'venue'; render(); }
  if (action === 'clarify') { state.dialog = 'clarification'; render(); }
  if (['review', 'propose', 'accept', 'decline'].includes(action)) {
    const r = currentRequest(); snapshotUndo();
    const proposalClarity = clarityLevel(r);
    const hadResponse = Boolean(r.first_entertainer_action_at);
    recordResponse(r, statusValue('Viewed'));
    if (action === 'review' && hadResponse) recordEvent(r, 'reviewed');
    if (action === 'review' && r.status === statusValue('Sent')) transition(r, statusValue('Viewed'));
    else if (action === 'propose') { recordEvent(r, 'proposal_sent', { clarity_level: proposalClarity }); transition(r, statusValue('Proposal Sent')); }
    else if (action !== 'review') { recordEvent(r, action === 'accept' ? 'accepted' : 'declined'); transition(r, statusValue(action === 'accept' ? 'Accepted' : 'Declined')); }
    if (action !== 'propose' || r.pricing_review_status === reviewValue('Pending')) r.pricing_review_status = reviewValue('Reviewed'); r.last_activity = stamp();
    notify(`${r.request_id} · ${r.status} · ${r.pricing_review_status}. Visible to ${r.venue_name}.`); render();
    app.querySelector('[data-action="undo"]')?.focus();
  }
  if (action === 'undo' && state.undo) { const previous = state.undo; state.data.items = previous.items; state.selectedItem = previous.selectedItem; state.view = previous.view; state.filters = previous.filters; state.undo = null; state.feedback = 'Change undone.'; render(); }
  if (action === 'dismiss') { state.feedback = ''; render(); }
});
document.addEventListener('input', event => {
  if (event.target.id === 'search') { state.filters.search = event.target.value; const matching = filteredProfiles().filter(p => `${p.entertainer_name} ${p.event_types.join(' ')}`.toLowerCase().includes(state.filters.search.toLowerCase())); if (!matching.some(p => p.entertainer_id === state.selectedProfile)) state.selectedProfile = matching[0]?.entertainer_id ?? null; render(); }
  if (event.target.closest('#request-form') && event.target.name) { state.form[event.target.name] = event.target.value; updateFormFeedback(); }
});
document.addEventListener('change', event => {
  if (event.target.id === 'event-filter') {
    state.filters.event_type = event.target.value || null; state.filters.search = '';
    const profiles = filteredProfiles(); const requests = filteredRequests();
    if (!profiles.some(p => p.entertainer_id === state.selectedProfile)) state.selectedProfile = profiles[0]?.entertainer_id ?? null;
    if (!requests.some(r => r.request_id === state.selectedItem)) state.selectedItem = requests[0]?.request_id ?? null;
    state.compare = state.compare.filter(id => profiles.some(p => p.entertainer_id === id));
    if (state.view === 'compare' && state.compare.length < 2) state.view = 'profiles';
    state.form = null; render();
  }
  if (event.target.id === 'venue-select') { state.venueId = event.target.value; state.form = null; render(); }
  if (event.target.dataset.compare) { const id = event.target.dataset.compare; state.compare = event.target.checked ? [...state.compare, id].slice(0, 3) : state.compare.filter(i => i !== id); render(); app.querySelector(`[data-compare="${CSS.escape(id)}"]`)?.focus(); }
});
document.addEventListener('submit', event => { if (event.target.id === 'request-form') sendRequest(event); if (event.target.id === 'clarification-form') clarify(event); });
document.addEventListener('keydown', event => {
  if (event.target.getAttribute('role') === 'tab' && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); state.view = event.key === 'Home' ? 'profiles' : event.key === 'End' ? 'insights' : event.target.id === 'insights-tab' ? 'profiles' : 'insights'; render(); document.getElementById(state.view === 'insights' ? 'insights-tab' : 'workspace-tab').focus(); }
});
async function init() {
  try {
    const response = await fetch('../data/requests.json');
    if (!response.ok) throw new Error(`Dataset request failed (${response.status}).`);
    state.data = await response.json();
    if (!Array.isArray(state.data.items) || !state.data.metadata || !state.data.entertainers?.length || !state.data.venues?.length) throw new Error('The dataset is missing requests, profiles, venues, or metadata.');
    for (const specification of metadata().filters.specifications) state.filters[specification.field] = specification.default;
    state.selectedProfile = state.data.entertainers[0].entertainer_id;
    state.venueId = state.data.venues[0].venue_id;
    state.selectedItem = state.data.items[0]?.request_id ?? null;
    render();
  } catch (error) {
    app.removeAttribute('aria-busy');
    app.innerHTML = `<section class="empty-state"><h2 class="empty-state-title">Could not load pricing data</h2><p class="empty-state-body">${esc(error.message)} Serve the repository over HTTP and open /src/index.html.</p></section>`;
  }
}
init();
