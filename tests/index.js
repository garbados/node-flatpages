var flatpages = require('../lib')
var tap = require('tap')
var fsMock = require('mock-fs')

tap.test('flatpages', (group) => {
  group.beforeEach((done) => {
    fsMock({
      'entries': {
        'hello.md': '# wow',
        'advanced.md': 'title: Hello, world!\n\n\n# omg wat\n'
      }
    })
    done()
  })

  group.afterEach((done) => {
    fsMock.restore()
    done()
  })

  group.test('verify processing', (test) => {
    flatpages('entries')
      .then((pages) => {
        test.equal(pages['hello.md'].html, '<h1 id="wow">wow</h1>', 'Should process markdown correctly.')
        test.equal(pages['advanced.md'].meta.title, 'Hello, world!', 'Should process YAML correctly.')
        test.end()
      })
  })

  group.end()
})
