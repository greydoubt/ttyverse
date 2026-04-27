// obtain input element through DOM

// This is a non-trivial requirement to implement for user agents, and is thus not a must but a should [RFC2119]. User agents should endeavor to have a File object’s snapshot state set to the state of the underlying storage on disk at the time the reference is taken. If the file is modified on disk following the time a reference has been taken, the File’s snapshot state will differ from the state of the underlying storage. User agents may use modification time stamps and other mechanisms to maintain snapshot state, but this is left as an implementation detail.


var file = document.getElementById('file').files[0];
if(file)
{
  // create an identical copy of file
  // the two calls below are equivalent

  var fileClone = file.slice();
  var fileClone2 = file.slice(0, file.size);

  // slice file into 1/2 chunk starting at middle of file
  // Note the use of negative number

  var fileChunkFromEnd = file.slice(-(Math.round(file.size/2)));

  // slice file into 1/2 chunk starting at beginning of file

  var fileChunkFromStart = file.slice(0, Math.round(file.size/2));

  // slice file from beginning till 150 bytes before end

  var fileNoMetadata = file.slice(0, -150, "application/experimental");
}
