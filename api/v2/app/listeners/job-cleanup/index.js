const config = require('../../config.js');
const {job, logger} = config;
const utils = require('../../utils');

module.exports = {
    //finds users in the waiting list not in the request list and deletes their jobs
    "pre-request": async (ctx, next) => {
        const {requestState, waitingState} = ctx;
        for (let id in waitingState) {
            if (!requestState[id]) { //user in waiting is not in the requests
                logger.debug(`Stopping job of user ${id}`); //core-hmi-${id}
                const jobName = await job.idToJobName(id);
                await utils.stopJob(jobName, true); //purge the job from Nomad
            }
        }
        next();
    }
}