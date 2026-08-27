/**
 * @file health.controller.js
 * @description Controller handling API health status verification requests.
 * @layer Server Controller
 * @interacts health.routes.js
 * @futureWork Include database connectivity status check in Step 3.
 * @nonGoal Do not handle business logic, issuance, or auth here.
 */

/**
 * Get system health status
 * @route GET /api/health
 */
export const getHealthStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'CertiVault API is running'
  });
};
