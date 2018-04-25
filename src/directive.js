import u from './utils'

const POINTER_START_EVENTS = ['mousedown', 'touchstart']
const POINTER_MOVE_EVENTS = ['mousemove', 'touchmove']
const POINTER_END_EVENTS = ['mouseup', 'touchend']

let init = function (el, binding) {
  let newScrollX, newScrollY
  var reset = function () {
    let lastClientX, lastClientY, pushed

    el.md = function (e) {
      let hasNoChildDrag = binding.arg === 'nochilddrag'
      let hasFirstChildDrag = binding.arg === 'firstchilddrag'
      let isEl = document.elementFromPoint(e.pageX - window.pageXOffset, e.pageY - window.pageYOffset) === el
      let isFirstChild = document.elementFromPoint(e.pageX - window.pageXOffset, e.pageY - window.pageYOffset) === el.firstChild

      let start = (e) => {
        pushed = 1
        lastClientX = e.clientX
        lastClientY = e.clientY
        e.preventDefault()
      }

      if (hasNoChildDrag) {
        if (isEl) {
          start(e)
        }
      } else if (hasFirstChildDrag) {
        if (isEl || isFirstChild) {
          start(e)
        }
      } else {
        start(e)
      }
    }

    el.mu = function () { pushed = 0 }

    el.mm = function (e) {
      if (pushed) {
        if (binding.modifiers.x) {
          el.scrollLeft -= newScrollX = (-lastClientX + (lastClientX = e.clientX))
          if (el === document.body) {
            el.scrollLeft -= newScrollX
          }
        } else if (binding.modifiers.y) {
          el.scrollTop -= newScrollY = (-lastClientY + (lastClientY = e.clientY))
          if (el === document.body) {
            el.scrollTop -= newScrollY
          }
        } else {
          el.scrollLeft -= newScrollX = (-lastClientX + (lastClientX = e.clientX))
          el.scrollTop -= newScrollY = (-lastClientY + (lastClientY = e.clientY))
          if (el === document.body) {
            el.scrollLeft -= newScrollX
            el.scrollTop -= newScrollY
          }
        }
      }
    }

    u.addEventListeners(el, POINTER_START_EVENTS, el.md)

    u.addEventListeners(window, POINTER_END_EVENTS, el.mu)

    u.addEventListeners(window, POINTER_MOVE_EVENTS, el.mm)
  }
  // if value is undefined or true we will init
  if (binding.value === undefined || binding.value === true) {
    if (document.readyState === 'complete') {
      reset()
    } else {
      window.addEventListener('load', reset)
    }
  } else {
    // if value is false means we disable
    // if value is anything else log error 
    if (binding.value) {
      console.error('The passed value should be either \'undefined\', \'true\' or \'false\'.')
    }

    // window.removeEventListener('load', reset)
    u.removeEventListeners(el, POINTER_START_EVENTS, el.md)
    u.removeEventListeners(window, POINTER_END_EVENTS, el.mu)
    u.removeEventListeners(window, POINTER_MOVE_EVENTS, el.mm)
  }
}

export default {
  bind: function (el, binding, vnode) {
    init(el, binding)
  },
  update: function (el, binding, vnode, oldVnode) {
    if (binding.value !== binding.oldValue) {
      init(el, binding)
    }
  },
  unbind: function (el, binding, vnode) {
    u.removeEventListeners(el, POINTER_START_EVENTS, el.md)
    u.removeEventListeners(window, POINTER_END_EVENTS, el.mu)
    u.removeEventListeners(window, POINTER_MOVE_EVENTS, el.mm)
  }
}
