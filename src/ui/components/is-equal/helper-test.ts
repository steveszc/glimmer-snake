import isEqual from './helper';

const { module, test } = QUnit;

module('Helper: is-equal', function(hooks) {
  test('it computes', function(assert) {
    assert.equal(isEqual(['a', 'a']), true);
    assert.equal(isEqual(['a', 'b']), false);
    assert.equal(isEqual([1, 1]), true);
    assert.equal(isEqual([1, 2]), false);
  });
});
