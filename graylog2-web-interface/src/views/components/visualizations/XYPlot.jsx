// @flow strict
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { get, merge } from 'lodash';

// $FlowFixMe: imports from core need to be fixed in flow
import connect from 'stores/connect';
// $FlowFixMe: imports from core need to be fixed in flow
import CombinedProvider from 'injection/CombinedProvider';

import { SearchActions, SearchStore } from 'views/stores/SearchStore';
import AggregationWidgetConfig from 'views/logic/aggregationbuilder/AggregationWidgetConfig';
import { CurrentQueryStore } from 'views/stores/CurrentQueryStore';
import { QueriesActions } from 'views/stores/QueriesStore';
import Query from 'views/logic/queries/Query';

import GenericPlot from './GenericPlot';

const { CurrentUserStore } = CombinedProvider.get('CurrentUser');

const onZoom = (config, currentQuery, currentUser, from, to) => {
  const { timezone } = currentUser;

  const newTimerange = {
    type: 'absolute',
    from: moment.tz(from, timezone).toISOString(),
    to: moment.tz(to, timezone).toISOString(),
  };

  QueriesActions.timerange(currentQuery.id, newTimerange).then(SearchActions.executeWithCurrentState);
  return false;
};

const XYPlot = ({ config, chartData, currentQuery, currentUser, effectiveTimerange, getChartColor, setChartColor, plotLayout = {} }) => {
  const layout = merge({
    yaxis: {
      fixedrange: true,
    },
  }, plotLayout);
  let _onZoom = () => true;
  if (config.isTimeline) {
    const { timezone } = currentUser;
    const normalizedFrom = moment.tz(effectiveTimerange.from, timezone).format();
    const normalizedTo = moment.tz(effectiveTimerange.to, timezone).format();
    layout.xaxis = {
      range: [normalizedFrom, normalizedTo],
    };
    _onZoom = (from, to) => onZoom(config, currentQuery, currentUser, from, to);
  } else {
    layout.xaxis = {
      fixedrange: true,
      /* disable plotly sorting by setting the type of the xaxis to category */
      type: config.sort.length > 0 ? 'category' : undefined,
    };
  }

  return (
    <GenericPlot chartData={chartData}
                 layout={layout}
                 onZoom={_onZoom}
                 getChartColor={getChartColor}
                 setChartColor={setChartColor} />
  );
};

XYPlot.propTypes = {
  chartData: PropTypes.array.isRequired,
  config: PropTypes.instanceOf(AggregationWidgetConfig).isRequired,
  currentUser: PropTypes.shape({
    timezone: PropTypes.string.isRequired,
  }).isRequired,
  currentQuery: PropTypes.instanceOf(Query).isRequired,
  effectiveTimerange: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }).isRequired,
  plotLayout: PropTypes.object,
  getChartColor: PropTypes.func.isRequired,
  setChartColor: PropTypes.func.isRequired,
};

XYPlot.defaultProps = {
  plotLayout: {},
};

export default connect(XYPlot, {
  currentQuery: CurrentQueryStore,
  currentUser: CurrentUserStore,
  searches: SearchStore,
}, ({ currentQuery, currentUser, searches }) => ({
  currentQuery,
  currentUser: currentUser.currentUser,
  effectiveTimerange: get(searches.result.forId(currentQuery.id), ['effectiveTimerange'], {}),
}));