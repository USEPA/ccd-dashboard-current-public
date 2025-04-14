'use strict'

module.exports = ({ github, core }) => {
  const payload = {
    // the name of this repo
    repo: process.env.REPO_NAME,
    pullRequestNumber: process.env.PR_NUMBER,
    ref: process.env.REF,
    feedbackCommentId: process.env.FEEDBACK_COMMENT_ID,
    commit: process.env.COMMIT_SHA,
  }

  core.info(JSON.stringify(payload))

  return new Promise((resolve, reject) => {
    // https://octokit.github.io/rest.js/v19#repos-create-dispatch-event
    github.rest.repos
      .createDispatchEvent({
        owner: 'USEPA',
        repo: 'ccd-cypress',
        event_type: 'trigger-tests',
        client_payload: payload,
      })
      .then(() => {
        resolve({
          status: 'success',
          message: '✅ Success',
          payload,
        })
      })
      .catch((err) => {
        core.error(`Failed to dispatch event:${err}`)
        // In order to send error message in the following steps, do not raise an error
        resolve({
          status: 'fail',
          message: `❌ Error: ${err.message || 'Unknown error'}`,
          payload,
        })
      })
  })
}
