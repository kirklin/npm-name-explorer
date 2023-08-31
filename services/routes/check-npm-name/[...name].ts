import checkNpmNameExists from "npm-name-explorer";

export default eventHandler(async (event) => {
  try {
    const packageExists = await checkNpmNameExists(`${event.context.params.name}`);
    return createSuccessResponse({ packageExists });
  } catch (error) {
    return createErrorResponse(getErrorMessage(error));
  }
});
