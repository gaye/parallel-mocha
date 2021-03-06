var assert = require('assert'),
    exec = require('child_process').exec,
    fmt = require('util').format,
    os = require('os'),
    path = require('path');


suite('e2e', function() {
  var stdout, stderr, err;

  setup(function(done) {
    var command = './mocha-parallel';
    var args = [
      '--cwd',
      path.join(__dirname, 'fixtures'),
      '--format',
      '"' + path.resolve(__dirname, '../node_modules/.bin/mocha') + ' ' +
          '--ui tdd %s"',
      '--tasks',
      '"pass_test.js pend_test.js fail_test.js"'
    ];

    exec(command + ' ' + args.join(' '), function(_err, _stdout, _stderr) {
      err = _err;
      stdout = _stdout;
      stderr = _stderr;
      done();
    });
  });

  test('should have 1 passing test', function() {
    assert.ok(stdout.indexOf('1 passing') !== -1);
  });

  test('should have 1 pending test', function() {
    assert.ok(stdout.indexOf('1 pending') !== -1);
  });

  test('should have 1 failing test', function() {
    assert.ok(stdout.indexOf('1 failing') !== -1);
  });

  test('should have failing test in epilogue', function() {
    assert.ok(stderr.indexOf('1) fail_test fail:') !== -1);
    assert.ok(stderr.indexOf('AssertionError: false == true' !== -1));
  });

  test('should have no errors', function() {
    assert.ok(!err);
  });

  test('should default to number of cpus', function() {
    var expected = fmt('%d parallel', os.cpus().length);
    assert.ok(stdout.indexOf(expected) !== -1);
  });
});
