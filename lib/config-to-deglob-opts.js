const configToDeglobOpts = ({
  gitIgnore,
  ignore,
  cwd
}) => ({
  useGitIgnore: gitIgnore || false,
  usePackageJson: false,
  ignore,
  cwd
})

module.exports = configToDeglobOpts
