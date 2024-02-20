import ReactGA  from 'react-ga';

const googleAnalyticsActions = {};

googleAnalyticsActions.initGoogleAnalytics = async (key, action, category) => {
  ReactGA.initialize(key);
  ReactGA.pageview(window.location.pathname + window.location.search);
  ReactGA.event({
    action: action,
    category: category
  })
};

export { googleAnalyticsActions };
