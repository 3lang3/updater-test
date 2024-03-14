const { notarize } = require('@electron/notarize')
const path = require('path')

exports.default = async function notarizing(context) {
  if (
    context.electronPlatformName !== 'darwin' ||
    process.env.CSC_IDENTITY_AUTO_DISCOVERY === 'false'
  ) {
    console.log('Skipping notarization')
    return
  }
  console.log('Notarizing...')

  const appBundleId = context.packager.appInfo.info._configuration.appId
  const appName = context.packager.appInfo.productFilename
  const appPath = path.normalize(path.join(context.appOutDir, `${appName}.app`))
  const appleId = process.env.APPLE_ID
  const appleIdPassword = process.env.APPLE_APP_SPECIFIC_PASSWORD
  const teamId = process.env.ASC_PROVIDER
  console.log('🚀', appBundleId)
  console.log('🚀', appName)
  console.log('🚀', appPath)
  console.log('🚀', appleId)
  console.log('🚀', appleIdPassword)
  console.log('🚀', teamId)

  if (!appleId) {
    console.warn('Not notarizing: Missing APPLE_ID environment variable')
    return
  }
  if (!appleIdPassword) {
    console.warn('Not notarizing: Missing APPLE_ID_PASSWORD environment variable')
    return
  }
  return notarize({
    appBundleId,
    appPath,
    appleId,
    appleIdPassword,
    teamId
  })
}
