import multiply from './helper';

const { module, test } = QUnit;

module('Helper: multiply', function(hooks) {
  test('it computes', function(assert) {
    assert.equal(multiply([3,2]), 6);
  });
});
