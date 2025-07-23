module.exports = (options, loaderContext) => {
  return { code: `module.exports = window["${options.options.module}"]("${options.options.module}")` };
};
