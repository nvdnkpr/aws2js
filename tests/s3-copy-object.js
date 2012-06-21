var assert = require('assert');
var s3 = require('../').load('s3');
var source = 'foo.png';
var destination = 'bar.png';

var callbacks = {
	putFile: false,
	copyObject: false,
	head: false,
	delSource: false,
	delDestination: false
};

s3.setCredentials(process.env.AWS_ACCEESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
s3.setBucket(process.env.AWS2JS_S3_BUCKET);

s3.putFile(source, './data/foo.png', false, {}, function (err, res) {
	callbacks.putFile = true;
	assert.ifError(err);
	
	s3.copyObject(s3.getBucket() + '/' + source, destination, false, {}, function (err, res) {
		callbacks.copyObject = true;
		assert.ifError(err);
		
		s3.head(destination, function (err, res) {
			callbacks.head = true;
			assert.ifError(err);
			assert.deepEqual(res['content-type'], 'image/png');
			
			s3.del(source, function (err, res) {
				callbacks.delSource = true;
				assert.ifError(err);
			});
			
			s3.del(destination, function (err, res) {
				callbacks.delDestination = true;
				assert.ifError(err);
			});
		});
	});
});

process.on('exit', function () {
	for (var i in callbacks) {
		assert.ok(callbacks[i]);
	}
});
