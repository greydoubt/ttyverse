// The File Reading Task Source

// This specification defines a new generic task source called the file reading task source, which is used for all tasks that are queued in this specification to read byte sequences associated with Blob and File objects. It is to be used for features that trigger in response to asynchronously reading binary data.
// The FileReader API

// A FileReader has an associated state, that is "empty", "loading", or "done". It is initially "empty".

// A FileReader has an associated result (null, a DOMString or an ArrayBuffer). It is initially null.

  
[Exposed=(Window,Worker)]
interface FileReader: EventTarget {
  constructor();
  // async read methods
  undefined readAsArrayBuffer(Blob blob);
  undefined readAsBinaryString(Blob blob);
  undefined readAsText(Blob blob, optional DOMString encoding);
  undefined readAsDataURL(Blob blob);

  undefined abort();

  // states
  const unsigned short EMPTY = 0;
  const unsigned short LOADING = 1;
  const unsigned short DONE = 2;

  readonly attribute unsigned short readyState;

  // File or Blob data
  readonly attribute (DOMString or ArrayBuffer)? result;

  readonly attribute DOMException? error;

  // event handler content attributes
  attribute EventHandler onloadstart;
  attribute EventHandler onprogress;
  attribute EventHandler onload;
  attribute EventHandler onabort;
  attribute EventHandler onerror;
  attribute EventHandler onloadend;
};
