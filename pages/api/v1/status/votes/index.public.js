import { formatISO } from 'date-fns';
import { createRouter } from 'next-connect';

import analytics from 'models/analytics';
import authentication from 'models/authentication';
import authorization from 'models/authorization';
import cacheControl from 'models/cache-control';
import controller from 'models/controller.js';

export default createRouter()
  .use(controller.injectRequestMetadata)
  .use(authentication.injectAnonymousOrUser)
  .use(controller.logRequest)
  .use(cacheControl.noCache)
  .get(authorization.canRequest('read:votes:others'), getHandler)
  .handler(controller.handlerOptions);

async function getHandler(_, response) {
  const votesGraph = await analytics.getVotesGraph({
    limit: 1000,
    showUsernames: true,
  });

  return response.json({
    updated_at: formatISO(Date.now()),
    votesGraph,
  });
}
