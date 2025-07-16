// 浏览器兼容性polyfills

// 检查浏览器支持情况
export const checkBrowserSupport = () => {
  const features = {
    crypto: typeof window !== 'undefined' && !!window.crypto && !!window.crypto.getRandomValues,
    localStorage: typeof window !== 'undefined' && !!window.localStorage,
    es6: typeof Symbol !== 'undefined',
    promises: typeof Promise !== 'undefined',
    fetch: typeof fetch !== 'undefined'
  }

  const unsupported = Object.keys(features).filter(key => !features[key as keyof typeof features])
  
  if (unsupported.length > 0) {
    console.warn('浏览器不支持以下功能:', unsupported)
    return false
  }
  
  return true
}

// 添加必要的polyfills
export const loadPolyfills = () => {
  // 如果需要支持IE11，可以在这里添加polyfills
  // 例如：import 'core-js/stable'
  //       import 'regenerator-runtime/runtime'
}

// 获取浏览器信息
export const getBrowserInfo = () => {
  if (typeof window === 'undefined') return null
  
  const ua = navigator.userAgent
  const browser = {
    chrome: /chrome|crios/i.test(ua),
    firefox: /firefox|fxios/i.test(ua),
    safari: /safari/i.test(ua) && !/chrome|crios/i.test(ua),
    edge: /edg/i.test(ua),
    ie: /msie|trident/i.test(ua)
  }
  
  return browser
}