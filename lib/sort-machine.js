var order = [
    'position'
  , 'top'
  , 'right'
  , 'bottom'
  , 'left'
  , 'z-index'
  , 'display'
  , 'float'
  , 'width'
  , 'height'
  , 'max-width'
  , 'max-height'
  , 'min-width'
  , 'min-height'
  , 'padding'
  , 'padding-top'
  , 'padding-right'
  , 'padding-bottom'
  , 'padding-left'
  , 'margin'
  , 'margin-top'
  , 'margin-right'
  , 'margin-bottom'
  , 'margin-left'
  , 'margin-collapse'
  , 'margin-top-collapse'
  , 'margin-right-collapse'
  , 'margin-bottom-collapse'
  , 'margin-left-collapse'
  , 'overflow'
  , 'overflow-x'
  , 'overflow-y'
  , 'clip'
  , 'clear'
  , 'font'
  , 'font-family'
  , 'font-size'
  , 'font-smoothing'
  , 'osx-font-smoothing'
  , 'font-style'
  , 'font-weight'
  , 'hyphens'
  , 'src'
  , 'line-height'
  , 'letter-spacing'
  , 'word-spacing'
  , 'color'
  , 'text-align'
  , 'text-decoration'
  , 'text-indent'
  , 'text-overflow'
  , 'text-rendering'
  , 'text-size-adjust'
  , 'text-shadow'
  , 'text-transform'
  , 'word-break'
  , 'word-wrap'
  , 'white-space'
  , 'vertical-align'
  , 'list-style'
  , 'list-style-type'
  , 'list-style-position'
  , 'list-style-image'
  , 'pointer-events'
  , 'cursor'
  , 'background'
  , 'background-attachment'
  , 'background-color'
  , 'background-image'
  , 'background-position'
  , 'background-repeat'
  , 'background-size'
  , 'border'
  , 'border-collapse'
  , 'border-top'
  , 'border-right'
  , 'border-bottom'
  , 'border-left'
  , 'border-color'
  , 'border-image'
  , 'border-top-color'
  , 'border-right-color'
  , 'border-bottom-color'
  , 'border-left-color'
  , 'border-spacing'
  , 'border-style'
  , 'border-top-style'
  , 'border-right-style'
  , 'border-bottom-style'
  , 'border-left-style'
  , 'border-width'
  , 'border-top-width'
  , 'border-right-width'
  , 'border-bottom-width'
  , 'border-left-width'
  , 'border-radius'
  , 'border-top-right-radius'
  , 'border-bottom-right-radius'
  , 'border-bottom-left-radius'
  , 'border-top-left-radius'
  , 'border-radius-topright'
  , 'border-radius-bottomright'
  , 'border-radius-bottomleft'
  , 'border-radius-topleft'
  , 'content'
  , 'quotes'
  , 'outline'
  , 'outline-offset'
  , 'opacity'
  , 'filter'
  , 'visibility'
  , 'size'
  , 'zoom'
  , 'transform'
  , 'box-align'
  , 'box-flex'
  , 'box-orient'
  , 'box-pack'
  , 'box-shadow'
  , 'box-sizing'
  , 'table-layout'
  , 'animation'
  , 'animation-delay'
  , 'animation-duration'
  , 'animation-iteration-count'
  , 'animation-name'
  , 'animation-play-state'
  , 'animation-timing-function'
  , 'animation-fill-mode'
  , 'transition'
  , 'transition-delay'
  , 'transition-duration'
  , 'transition-property'
  , 'transition-timing-function'
  , 'background-clip'
  , 'backface-visibility'
  , 'resize'
  , 'appearance'
  , 'user-select'
  , 'interpolation-mode'
  , 'direction'
  , 'marks'
  , 'page'
  , 'set-link-source'
  , 'unicode-bidi'
  , 'speak'
  ]

function getRules(text) {
  // [ { 'rule': '', 'value': '', 'weight': 0 } ]
  // rule is compared from the end, as can contain padding
  // thus each rule should be compared to the whole order list
  // we don't compare vendor prefixes, as autoprefixer is used

  // split into lines
  var rules = []
  , line = ''
  _.forEach(text.split('\n'), function(rule) {
    line = rule.split(':')
    rules.push(
      {
        'property': line[0],
        'value': line[1],
        'weight': 0,
        'position': -1
      }
    )
  })
  return rules
}

function assignWeights(rules) {
  _.forEach(rules, function(rule) {
    rule.weight = _.indexOf(order, rule.property.trim()) + 1
    if (rule.weight == 0) rule.position = _.indexOf(rules, rule)
  })

  return rules
}

function sortRules(rules) {
  var staticPos = _.remove(rules, function(rule) { return rule.position > -1 })
  var sortedRules = _.sortBy(rules, 'weight')

  _.forEach(staticPos, function(rule) {
    sortedRules.splice(rule.position, 0, rule)
  })

  return sortedRules
}

function combineRules(rules) {
  var selection = ''
  _.forEach(rules, function(rule) {
    if (!rule.value) {
      selection += rule.property + '\n'
    } else if (!rule.property) {
      // do nothing
      console.log("Empty line!")
    } else {
      selection += rule.property + ':' + rule.value + '\n'
    }
  })
  return selection
}

module.exports.activate = function() {
  atom.workspaceView.command("sort-machine:launch",module.exports.launch)
}

module.exports.launch = function() {
    var selection = atom.workspace.getActiveEditor().getSelection()
    , text = selection.getText()
    , result = combineRules(sortRules(assignWeights(getRules(text))))
    // console.log(result.replace(/^\s+|\s+$/g, ''))
    // there might be one unnecessary trailing newline
    selection.insertText(result.replace(/\n$/, ''))
}
