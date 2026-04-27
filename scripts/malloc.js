//When a File object refers to a file on disk, user agents must return the type of that file, and must follow the file type guidelines below:

//    User agents must return the type as an ASCII-encoded string in lower case, such that when it is converted to a corresponding byte sequence, it is a parsable MIME type, or the empty string – 0 bytes – if the type cannot be determined.

//    When the file is of type text/plain user agents must NOT append a charset parameter to the dictionary of parameters portion of the media type [MIMESNIFF].

//    User agents must not attempt heuristic determination of encoding, including statistical methods.

[Exposed=(Window,Worker), Serializable]
interface File : Blob {
  constructor(sequence<BlobPart> fileBits,
              USVString fileName,
              optional FilePropertyBag options = {});
  readonly attribute DOMString name;
  readonly attribute long long lastModified;
};

dictionary FilePropertyBag : BlobPropertyBag {
  long long lastModified;
};
