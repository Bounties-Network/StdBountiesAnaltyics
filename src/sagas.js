import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';

const dateFormat = 'YYYY-MM-DD';

function fetchData(schema, since, until) {
  return axios({
    method: 'get',
    params: {
      format: 'json',
      since,
      until,
      is_weekly: true,
      schema
    },
    url: 'https://staging.api.bounties.network/analytics/'
  });
}

function parseData(raw) {
  const bountyDraft = [[], []];
  const bountyActive = [[], []];
  const bountyCompleted = [[], []];
  const bountyExpired = [[], []];
  const bountyDead = [[], []];

  const fulfillmentAcceptanceRate = [[], []];
  const bountyFulfilledRate = [[], []];
  const avgFulfillerAcceptanceRate = [[], []];

  const bountiesIssued = [[], []];
  const fulfillmentsSubmitted = [[], []];
  const fulfillmentsAccepted = [[], []];
  const fulfillmentsPendingAcceptance = [[], []];
  const avgFulfillmentAmount = [[], []];

  const fulfillmentsSubmittedCum = [[], []];
  const fulfillmentsAcceptedCum = [[], []];
  const bountiesIssuedCum = [[], []];

  for (let i = 0; i < raw.length; i += 1) {
    const date = Date.parse(raw[i].date);
    const p = raw[i].is_week ? 1 : 0;

    bountyDraft[p].push([date, raw[i].bounty_draft]);
    bountyActive[p].push([date, raw[i].bounty_active]);
    bountyCompleted[p].push([date, raw[i].bounty_completed]);
    bountyExpired[p].push([date, raw[i].bounty_expired]);
    bountyDead[p].push([date, raw[i].bounty_dead]);

    fulfillmentAcceptanceRate[p].push([date, raw[i].fulfillment_acceptance_rate]);
    bountyFulfilledRate[p].push([date, raw[i].bounty_fulfilled_rate]);
    avgFulfillerAcceptanceRate[p].push([date, raw[i].avg_fulfiller_acceptance_rate]);

    bountiesIssued[p].push([date, raw[i].bounties_issued]);
    fulfillmentsSubmitted[p].push([date, raw[i].fulfillments_submitted]);
    fulfillmentsAccepted[p].push([date, raw[i].fulfillments_accepted]);

    fulfillmentsPendingAcceptance[p].push([date, raw[i].fulfillments_pending_acceptance]);
    avgFulfillmentAmount[p].push([date, raw[i].avg_fulfillment_amount]);

    fulfillmentsSubmittedCum[p].push([date, raw[i].fulfillments_submitted_cum]);
    fulfillmentsAcceptedCum[p].push([date, raw[i].fulfillments_accepted_cum]);
    bountiesIssuedCum[p].push([date, raw[i].bounties_issued_cum]);
  }

  return {
    bountyDraft,
    bountyActive,
    bountyCompleted,
    bountyExpired,
    bountyDead,

    fulfillmentAcceptanceRate,
    bountyFulfilledRate,
    avgFulfillerAcceptanceRate,

    bountiesIssued,
    fulfillmentsSubmitted,
    fulfillmentsAccepted,

    fulfillmentsPendingAcceptance,
    avgFulfillmentAmount,

    bountiesIssuedCum,
    fulfillmentsSubmittedCum,
    fulfillmentsAcceptedCum
  };
}

// function that makes the api request and returns a Promise for response
function getData(schema, fromDate, toDate) {
  return fetchData(schema, fromDate, toDate)
    .then(res => parseData(res.data));
}

// worker saga: makes the api call when watcher saga sees the action
function* workerSaga(params) {
  try {
    const data = yield call(
      getData,
      params.schema,
      params.range[0].format(dateFormat),
      params.range[1].format(dateFormat)
    );

    // dispatch a success action to the store with the new data
    yield put({ type: 'API_CALL_SUCCESS', data });
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: 'API_CALL_FAILURE', error });
  }
}

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default function* watcherSaga() {
  yield takeLatest('API_CALL_REQUEST', workerSaga);
}
