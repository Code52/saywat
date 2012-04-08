var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , User
  , Answer
  , Wat
  ;

User = mongoose.model('User', new Schema({
    displayName: { type: String, trim: true, required: true, unique: true }
  , gravatarUrl: String
  }));

Answer = new Schema({
    _user: { type: ObjectId, ref: 'User', required: true }
  , content: { type: String, required: true }
  , posted: { type: Date, default: Date.now }
  });

Wat = mongoose.model('Wat', new Schema({
    _user: { type: ObjectId, ref: 'User', required: true }
  , phrase: { type: String, trim: true, required: true, index: true }
  , posted: { type: Date, default: Date.now }
  , region: String
  , example: String
  , answers: [Answer]
  }));

// See if we have any data, if not, create some
// This happens async, so if you are quick with your page load it may not be saved yet
User.count({}, function (err, count) {
  if (err || count !== 0) { return; }

  var flow = require('flow')
    , chris, paul, wat1, wat2;
  flow.exec(
    function () {
      chris = new User({
          displayName: 'csainty'
        , gravatarUrl: 'http://www.gravatar.com/avatar/11d733f04b06a8f13737b615d908745a.png'
        });
      chris.save(this);
    },
    function () {
      paul = new User({
          displayName: 'Aeoth'
        , gravatarUrl: ''
        });
      paul.save(this);
    },
    function () {
      wat1 = new Wat({
          _user: chris._id
        , phrase: 'arvo'
        , region: 'Australia'
        , example: 'What\'re you up to this arvo?'
        });
      wat1.answers.push({ _user: paul._id, content: 'Afternoon fool!' });
      wat1.save(this);
    },
    function () {
      wat2 = new Wat({
          _user: chris._id
        , phrase: 'sheila'
        , region: 'Australia'
        , example: 'Bonza sheila, that one!'
        });
      wat2.answers.push({ _user: paul._id, content: 'That\'s a lady!' });
      wat2.save();
    }
  );
});