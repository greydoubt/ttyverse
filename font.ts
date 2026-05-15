
public class AWTError extends Error {
    public AWTError(String msg) {
	super(msg);
    }
}

public class AWTException extends Exception {
 
    /**
     * Constructs an AWTException with the specified detail message. 
     * A detail message is a String that describes this particular
     * exception. 
     * @param msg the detail message
     */
    public AWTException(String msg) {
	super(msg);
    }
}

public final
class Class {
    /**
     * Make sure nobody instantiates this class
     */
    private Class() {}
    
    /**
     * Returns the runtime Class descriptor for the specified Class.
     * For example, the following code fragment returns the runtime
     * Class descriptor for the Class named java.lang.Thread:
     * <pre>
     *		Class t = Class.forName("java.lang.Thread")
     * </pre>
     * @param className	the fully qualified name of the desired Class
     * @exception	ClassNotFoundException If the Class could not be found.
     */
    public static native Class forName(String className) throws ClassNotFoundException;

    /**
     * Creates a new instance of this Class.
     * @return 		the new instance of this Class.
     * @exception	InstantiationException If you try to instantiate
     *                  an abstract class or an interface, or if
     *			the instantiation fails for some other reason.
     * @exception       IllegalAccessException If the class or initializer
     *                  is not accessible.
     */
    public native Object newInstance() 
	 throws InstantiationException, IllegalAccessException;

    /**
     * Returns the name of this Class.
     */
    public native String getName();

    /**
     * Returns the superclass of this Class.
     */
    public native Class getSuperclass();

    /**
     * Returns the interfaces of this Class. An array 
     * of length 0 is returned if this Class implements no interfaces.
     */
    public native Class getInterfaces()[];

    /**
     * Returns the Class loader of this Class.  Returns null
     *		if this Class does not have a Class loader.
     * @see	ClassLoader
     */
    public native ClassLoader getClassLoader();

    /**
     * Returns a boolean indicating whether or not this Class is an 
     * interface.
     */
    public native boolean isInterface();

    /**
     * Returns the name of this class or interface. The word 
     * "class" is prepended if it is a Class; the word "interface"
     * is prepended if it is an interface.
     */
    public String toString() {
	return (isInterface() ? "interface " : "class ") + getName();
    }
}

public abstract class InputStream {
    /**
     * Reads a byte of data. This method will block if no input is 
     * available.
     * @return 	the byte read, or -1 if the end of the
     *		stream is reached.
     * @exception IOException If an I/O error has occurred.
     */
    public abstract int read() throws IOException;

    /**
     * Reads into an array of bytes.  This method will
     * block until some input is available.
     * @param b	the buffer into which the data is read
     * @return  the actual number of bytes read, -1 is
     * 		returned when the end of the stream is reached.
     * @exception IOException If an I/O error has occurred.
     */
    public int read(byte b[]) throws IOException {
	return read(b, 0, b.length);
    }

    /**
     * Reads into an array of bytes.  This method will
     * block until some input is available.
     * @param b	the buffer into which the data is read
     * @param off the start offset of the data
     * @param len the maximum number of bytes read
     * @return  the actual number of bytes read, -1 is
     * 		returned when the end of the stream is reached.
     * @exception IOException If an I/O error has occurred.
     */
    public int read(byte b[], int off, int len) throws IOException {
	if (len <= 0) {
	    return 0;
	}

	int c = read();
	if (c == -1) {
	    return -1;
	}
	b[off] = (byte)c;

	int i = 1;
	try {
	    for (; i < len ; i++) {
		c = read();
		if (c == -1) {
		    break;
		}
		if (b != null) {
		    b[off + i] = (byte)c;
		}
	    }
	} catch (IOException ee) {
	}
	return i;
    }

    /**
     * Skips n bytes of input.
     * @param n the number of bytes to be skipped
     * @return	the actual number of bytes skipped.
     * @exception IOException If an I/O error has occurred.
     */
    public long skip(long n) throws IOException {
	byte data[] = new byte[(int)n];
	return read(data);
    }

    /**
     * Returns the number of bytes that can be read
     * without blocking.
     * @return the number of available bytes.
     */
    public int available() throws IOException {
	return 0;
    }

    /**
     * Closes the input stream. Must be called
     * to release any resources associated with
     * the stream.
     * @exception IOException If an I/O error has occurred.
     */
    public void close() throws IOException {}

    /**
     * Marks the current position in the input stream.  A subsequent
     * call to reset() will reposition the stream at the last
     * marked position so that subsequent reads will re-read
     * the same bytes.  The stream promises to allow readlimit bytes
     * to be read before the mark position gets invalidated.
     *
     * @param readlimit the maximum limit of bytes allowed to be read
     * before the mark position becomes invalid.
     */
    public synchronized void mark(int readlimit) {}

    /**
     * Repositions the stream to the last marked position.  If the
     * stream has not been marked, or if the mark has been invalidated,
     * an IOException is thrown.  Stream marks are intended to be used in
     * situations where you need to read ahead a little to see what's in
     * the stream.  Often this is most easily done by invoking some
     * general parser.  If the stream is of the type handled by the
     * parser, it just chugs along happily.  If the stream is not of
     * that type, the parser should toss an exception when it fails,
     * which, if it happens within readlimit bytes, allows the outer
     * code to reset the stream and try another parser.
     * @exception IOException If the stream has not been marked or 
     * if the mark has been invalidated.
     */
    public synchronized void reset() throws IOException {
	throw new IOException("mark/reset not supported");
    }

    /**
     * Returns a boolean indicating whether or not this stream type 
     * supports mark/reset.
     * @return true if this stream type supports mark/reset; false
     * otherwise.
     */
    public boolean markSupported() {
	return false;
    }
}
public
class CloneNotSupportedException extends Exception {
    /**
     * Constructs an CloneNotSupportedException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public CloneNotSupportedException() {
	super();
    }

    /**
     * Constructs an CloneNotSupportedException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public CloneNotSupportedException(String s) {
	super(s);
    }
}
public final class Compiler  {
    private Compiler() {}		// don't make instances
    
    private static native void initialize();

    static { 
	try { 
	    String library = System.getProperty("java.compiler");
	    if (library != null) {
		System.loadLibrary(library);
		initialize();
		}
	} catch (Throwable e) { 
	}
    }

    public static native boolean compileClass(Class clazz);
    public static native boolean compileClasses(String string);
    public static native Object command(Object any);
    public static native void enable();
    public static native void disable();
}
public final
class Double extends Number {
    /**
     * Positive infinity.
     */
    public static final double POSITIVE_INFINITY = 1.0 / 0.0;

    /**
     * Negative infinity.
     */
    public static final double NEGATIVE_INFINITY = -1.0 / 0.0;

    /** 
     * Not-a-Number. <em>Note: is not equal to anything, including
     * itself</em>
     */
    public static final double NaN = 0.0d / 0.0;

    /**
     * The maximum value a double can have.  The greatest maximum value that a 
     * double can have is 1.79769313486231570e+308d.
     */
    public static final double MAX_VALUE = 1.79769313486231570e+308;

    /**
     * The minimum value a double can have.  The lowest minimum value that a
     * double can have is 4.94065645841246544e-324d.
     */
    public static final double MIN_VALUE = 4.94065645841246544e-324;


    /**
     * Returns a String representation for the specified double value.
     * @param d	the double to be converted
     */
    public static native String toString(double d);

    /**
     * Returns a new Double value initialized to the value represented by the 
     * specified String.
     * @param s		the String to be parsed
     * @exception NumberFormatException If the String cannot be parsed.
     */
    public static native Double valueOf(String s) throws NumberFormatException;


    /**
     * Returns true if the specified number is the special Not-a-Number (NaN) value.
     * @param v	the value to be tested
     */
    static public boolean isNaN(double v) {
	return (v != v);
    }

    /**
     * Returns true if the specified number is infinitely large in magnitude.
     * @param v	the value to be tested
     */
    static public boolean isInfinite(double v) {
	return (v == POSITIVE_INFINITY) || (v == NEGATIVE_INFINITY);
    }

    /**
     * The value of the Double.
     */
    private double value;

    /**
     * Constructs a Double wrapper for the specified double value.
     * @param value the initial value of the double
     */
    public Double(double value) {
	this.value = value;
    }

    /**
     * Constructs a Double object initialized to the value specified by the
     * String parameter. 
     * @param s		the String to be converted to a Double
     * @exception	NumberFormatException If the String does not contain a parsable number.
     */
    public Double(String s) throws NumberFormatException {
	// REMIND: this is inefficient
	this(valueOf(s).doubleValue());
    }

    /**
     * Returns true if this Double value is the special Not-a-Number (NaN) value.
     */
    public boolean isNaN() {
	return isNaN(value);
    }

    /**
     * Returns true if this Double value is infinitely large in magnitude.
     */
    public boolean isInfinite() {
	return isInfinite(value);
    }

    /**
     * Returns a String representation of this Double object.
     */
    public String toString() {
	return String.valueOf(value);
    }

    /**
     * Returns the integer value of this Double (by casting to an int).
     */
    public int intValue() {
	return (int)value;
    }

    /**
     * Returns the long value of this Double (by casting to a long).
     */
    public long longValue() {
	return (long)value;
    }

    /**
     * Returns the float value of this Double.
     */
    public float floatValue() {
	return (float)value;
    }

    /**
     * Returns the double value of this Double.
     */
    public double doubleValue() {
	return (double)value;
    }

    /**
     * Returns a hashcode for this Double.
     */
    public int hashCode() {
	return (int)value;
    }

    /**
     * Compares this object against the specified object.
     * <p>
     * <em>Note: To be useful in hashtables this method
     * considers two NaN double values to be equal. This
     * is not according to IEEE specification</em>
     *
     * @param obj		the object to compare with
     * @return 		true if the objects are the same; false otherwise.
     */
    public boolean equals(Object obj) {
	return (obj != null)
	       && (obj instanceof Double) 
	       && (doubleToLongBits(((Double)obj).value) == 
		      doubleToLongBits(value));
    }

    /**
     * Returns the bit represention of a double-float value
     */
    public static native long doubleToLongBits(double value);

    /**
     * Returns the double-float corresponding to a given bit represention.
     */
    public static native double longBitsToDouble(long bits);
}



public
class Error extends Throwable {
    /**
     * Constructs an Error with no specified detail message.
     * A detail message is a String that describes this particular error.
     */
    public Error() {
	super();
    }

    /**
     * Constructs an Error with the specified detail message.
     * A detail message is a String that describes this particular error
     * @param s the detail message
     */
    public Error(String s) {
	super(s);
    }
}


public
class Exception extends Throwable {
    /**
     * Constructs an Exception with no specified detail message.
     * A detail message is a String that describes this particular exception.
     */
    public Exception() {
	super();
    }

    /**
     * Constructs a Exception with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public Exception(String s) {
	super(s);
    }
}

public final
class Float extends Number {
    /**
     * Positive infinity.
     */
    public static final float POSITIVE_INFINITY = 1.0f / 0.0f;

    /**
     * Negative infinity.
     */
    public static final float NEGATIVE_INFINITY = -1.0f / 0.0f;

    /** 
     * Not-a-Number. <em>Note: is not equal to anything, including
     * itself</em>
     */
    public static final float NaN = 0.0f / 0.0f;


    /**
     * The maximum value a float can have.  The largest maximum value possible is  
     * 3.40282346638528860e+38.
     */
    public static final float MAX_VALUE = 3.40282346638528860e+38f;

    /**
     * The minimum value a float can have.  The lowest minimum value possible is 
     * 1.40129846432481707e-45.
     */
    public static final float MIN_VALUE = 1.40129846432481707e-45f;

    /**
     * Returns a String representation for the specified float value.
     * @param f	the float to be converted
     */
    public static native String toString(float f);

    /**
     * Returns the floating point value represented by the specified String.
     * @param s		the String to be parsed
     * @exception	NumberFormatException If the String does not contain a parsable 
     * Float.
     */
    public static native Float valueOf(String s) throws NumberFormatException;

    /**
     * Returns true if the specified number is the special Not-a-Number (NaN) value.
     * @param v	the value to be tested
     */
    static public boolean isNaN(float v) {
	return (v != v);
    }

    /**
     * Returns true if the specified number is infinitely large in magnitude.
     * @param v	the value to be tested
     */
    static public boolean isInfinite(float v) {
	return (v == POSITIVE_INFINITY) || (v == NEGATIVE_INFINITY);
    }

    /**
     * The value of the Float.
     */
    private float value;

    /**
     * Constructs a Float wrapper for the specified float value.
     * @param value the value of the Float
     */
    public Float(float value) {
	this.value = value;
    }

    /**
     * Constructs a Float wrapper for the specified double value.
     * @param value the value of the Float
     */
    public Float(double value) {
	this.value = (float)value;
    }

    /**
     * Constructs a Float object initialized to the value specified by the
     * String parameter. 
     * @param s		the String to be converted to a Float
     * @exception	NumberFormatException If the String does not contain a parsable number.
     */
    public Float(String s) throws NumberFormatException {
	// REMIND: this is inefficient
	this(valueOf(s).floatValue());
    }

    /**
     * Returns true if this Float value is Not-a-Number (NaN).
     */
    public boolean isNaN() {
	return isNaN(value);
    }

    /**
     * Returns true if this Float value is infinitely large in magnitude.
     */
    public boolean isInfinite() {
	return isInfinite(value);
    }

    /**
     * Returns a String representation of this Float object.
     */
    public String toString() {
	return String.valueOf(value);
    }

    /**
     * Returns the integer value of this Float (by casting to an int).
     */
    public int intValue() {
	return (int)value;
    }

    /**
     * Returns the long value of this Float (by casting to a long).
     */
    public long longValue() {
	return (long)value;
    }

    /**
     * Returns the float value of this Float object.
     */
    public float floatValue() {
	return value;
    }

    /**
     * Returns the double value of this Float.
     */
    public double doubleValue() {
	return (double)value;
    }

    /**
     * Returns a hashcode for this Float.
     */
    public int hashCode() {
	return (int)value;
    }

    /**
     * Compares this object against some other object.
     * <p>
     * <em>Note: To be useful in hashtables this method
     * considers two Nan floating point values to be equal. This
     * is not according to IEEE specification</em>
     *
     * @param obj		the object to compare with
     * @return 		true if the objects are the same; false otherwise.
     */
    public boolean equals(Object obj) {
	return (obj != null)
	       && (obj instanceof Float) 
	       && (floatToIntBits(((Float)obj).value) == floatToIntBits(value));
    }

    /**
     * Returns the bit represention of a single-float value
     */
    public static native int floatToIntBits(float value);

    /**
     * Returns the single-float corresponding to a given bit represention.
     */
    public static native float intBitsToFloat(int bits);

}


public class IllegalAccessError extends IncompatibleClassChangeError {
    /**
     * Constructs an IllegalAccessError with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public IllegalAccessError() {
	super();
    }

    /**
     * Constructs an IllegalAccessError with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public IllegalAccessError(String s) {
	super(s);
    }
}
public
class IllegalAccessException extends Exception {
    /**
     * Constructs a IllegalAccessException without a detail message.
     * A detail message is a String that describes this particular exception.
     */
    public IllegalAccessException() {
	super();
    }

    /**
     * Constructs a IllegalAccessException with a detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public IllegalAccessException(String s) {
	super(s);
    }
}

public
class IllegalArgumentException extends RuntimeException {
    /**
     * Constructs an IllegalArgumentException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public IllegalArgumentException() {
	super();
    }

    /**
     * Constructs an IllegalArgumentException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public IllegalArgumentException(String s) {
	super(s);
    }
}

public
class IllegalArgumentException extends RuntimeException {
    /**
     * Constructs an IllegalArgumentException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public IllegalArgumentException() {
	super();
    }

    /**
     * Constructs an IllegalArgumentException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public IllegalArgumentException(String s) {
	super(s);
    }
}

public
class IllegalArgumentException extends RuntimeException {
    /**
     * Constructs an IllegalArgumentException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public IllegalArgumentException() {
	super();
    }

    /**
     * Constructs an IllegalArgumentException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public IllegalArgumentException(String s) {
	super(s);
    }
}

public
class IllegalArgumentException extends RuntimeException {
    /**
     * Constructs an IllegalArgumentException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public IllegalArgumentException() {
	super();
    }

    /**
     * Constructs an IllegalArgumentException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public IllegalArgumentException(String s) {
	super(s);
    }
}
public
class IllegalMonitorStateException extends RuntimeException {
    /**
     * Constructs an IllegalMonitorStateException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public IllegalMonitorStateException() {
	super();
    }

    /**
     * Constructs an IllegalMonitorStateException with the specified detail
     * message.  A detail message is a String that describes this particular
     * exception.
     * @param s the String that contains a detailed message
     */
    public IllegalMonitorStateException(String s) {
	super(s);
    }
}
public class IllegalThreadStateException extends IllegalArgumentException {
    /**
     * Constructs an IllegalThreadStateException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public IllegalThreadStateException() {
	super();
    }

    /**
     * Constructs an IllegalThreadStateException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public IllegalThreadStateException(String s) {
	super(s);
    }
}
public
class IncompatibleClassChangeError extends LinkageError {
    /**
     * Constructs an IncompatibleClassChangeError with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public IncompatibleClassChangeError () {
	super();
    }

    /**
     * Constructs an IncompatibleClassChangeError with the specified detail 
     * message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public IncompatibleClassChangeError(String s) {
	super(s);
    }
}

public
class IndexOutOfBoundsException extends RuntimeException {
    /**
     * Constructs an IndexOutOfBoundsException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public IndexOutOfBoundsException() {
	super();
    }

    /**
     * Constructs a IndexOutOfBoundsException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public IndexOutOfBoundsException(String s) {
	super(s);
    }
}
public
class InstantiationError extends IncompatibleClassChangeError {
    /**
     * Constructs an InstantiationError with no detail message.  A detail 
     * message is a String that describes this particular exception.
     */
    public InstantiationError() {
	super();
    }

    /**
     * Constructs an InstantiationError with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the String that contains the detail message
     */
    public InstantiationError(String s) {
	super(s);
    }
}

public
class InstantiationException extends Exception {
    /**
     * Constructs an InstantiationException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public InstantiationException() {
	super();
    }

    /**
     * Constructs an InstantiationException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the String containing a detail message
     */
    public InstantiationException(String s) {
	super(s);
    }
}

public final
class Integer extends Number {
    /**
     * The minimum value an Integer can have.  The lowest minimum value an
     * Integer can have is 0x80000000.
     */
    public static final int   MIN_VALUE = 0x80000000;

    /**
     * The maximum value an Integer can have.  The greatest maximum value an
     * Integer can have is 0x7fffffff.
     */
    public static final int   MAX_VALUE = 0x7fffffff;

    /**
     * Returns a new String object representing the specified integer in
     * the specified radix.
     * @param i		the integer to be converted
     * @param radix	the radix
     * @see Character#MIN_RADIX
     * @see Character#MAX_RADIX
     */
    public static String toString(int i, int radix) {
	StringBuffer buf;
	int digitCount = 0;
	boolean minval = false;
	boolean negative = false;
	if (i == 0x80000000) {
            switch (radix) {
                case 2:  return "-10000000000000000000000000000000";
                case 4:  return "-2000000000000000";
                case 8:  return "-20000000000";
                case 16: return "-80000000";
                default: 
                    minval = negative = true;
                    i = MAX_VALUE;
            }
	} else if (i < 0) {
	    i = -i;
	    negative = true;
	}
	buf = new StringBuffer(32);
	while (i > 0) {
	    if (i < radix) {
		buf.append(Character.forDigit(i,radix));
		i = 0;
	    } else {
		int j = i % radix;
		i = i / radix;
		buf.append(Character.forDigit(j,radix));
	    }
	    digitCount++;
	}
	if (digitCount > 0) {
	    int j = buf.length();
	    int k = 0;
	    char tmp[];
	    if (negative) {
		tmp = new char[j + 1];
		tmp[0] = '-';
		k = 1;
	    } else {
		tmp = new char[j];
	    }
	    i = 0;
	    while (j-- > 0) {
		tmp[j+k] = buf.charAt(i++);
	    }
	    if (minval) {
		tmp[tmp.length-1]++;
	    }
	    return String.valueOf(tmp);
	} else
	    return "0";
    }

    /**
     * Returns a new String object representing the specified integer. The radix
     * is assumed to be 10.
     * @param i	the integer to be converted
     */
    public static String toString(int i) {
	return toString(i,10);
    }
    
    /**
     * Assuming the specified String represents an integer, returns that integer's
     * value. Throws an exception if the String cannot be parsed as an int.
     * @param s		the String containing the integer
     * @param radix 	the radix to be used
     * @exception	NumberFormatException If the String does not contain a parsable 
     *                                        integer.
     */
    public static int parseInt(String s, int radix) throws NumberFormatException {
        if (s == null) {
            throw new NumberFormatException("null");
        }
	int result = 0;
	boolean negative = false;
	int i=0, max = s.length();
	if (max > 0) {
	    if (s.charAt(0) == '-') {
		negative = true;
		i++;
	    }
	    while (i < max) {
		int digit = Character.digit(s.charAt(i++),radix);
		if (digit < 0)
		    throw new NumberFormatException(s);
		result = result * radix + digit;
	    }
	} else
	    throw new NumberFormatException(s);
	if (negative)
	    return -result;
	else
	    return result;
    }

    /**
     * Assuming the specified String represents an integer, returns that integer's
     * value. Throws an exception if the String cannot be parsed as an int.
     * The radix is assumed to be 10.
     * @param s		the String containing the integer
     * @exception	NumberFormatException If the string does not contain a parsable 
     *                                        integer.
     */
    public static int parseInt(String s) throws NumberFormatException {
	return parseInt(s,10);
    }

    /**
     * Assuming the specified String represents an integer, returns a new Integer
     * object initialized to that value. Throws an exception if the String cannot be
     * parsed as an int.
     * @param s		the String containing the integer
     * @param radix 	the radix to be used
     * @exception	NumberFormatException If the String does not contain a parsable 
     *                                        integer.
     */
    public static Integer valueOf(String s, int radix) throws NumberFormatException {
	return new Integer(parseInt(s,radix));
    }

    /**
     * Assuming the specified String represents an integer, returns a new Integer
     * object initialized to that value. Throws an exception if the String cannot be
     * parsed as an int. The radix is assumed to be 10.
     * @param s		the String containing the integer
     * @exception	NumberFormatException If the String does not contain a parsable 
     *                                        integer.
     */
    public static Integer valueOf(String s) throws NumberFormatException
    {
	return new Integer(parseInt(s, 10));
    }

    /**
     * The value of the Integer.
     */
    private int value;

    /**
     * Constructs an Integer object initialized to the specified int value.
     * @param value	the initial value of the Integer
     */
    public Integer(int value) {
	this.value = value;
    }

    /**
     * Constructs an Integer object initialized to the value specified by the
     * String parameter.  The radix is assumed to be 10.
     * @param s		the String to be converted to an Integer
     * @exception	NumberFormatException If the String does not contain a parsable 
     *                                        integer.
     */
    public Integer(String s) throws NumberFormatException {
	this.value = parseInt(s, 10);
    }

    /**
     * Returns the value of this Integer as an int.
     */
    public int intValue() {
	return value;
    }

    /**
     * Returns the value of this Integer as a long.
     */
    public long longValue() {
	return (long)value;
    }

    /**
     * Returns the value of this Integer as a float.
     */
    public float floatValue() {
	return (float)value;
    }

    /**
     * Returns the value of this Integer as a double.
     */
    public double doubleValue() {
	return (double)value;
    }

    /**
     * Returns a String object representing this Integer's value.
     */
    public String toString() {
	return String.valueOf(value);
    }

    /**
     * Returns a hashcode for this Integer.
     */
    public int hashCode() {
	return value;
    }

    /**
     * Compares this object to the specified object.
     * @param obj	the object to compare with
     * @return 		true if the objects are the same; false otherwise.
     */
    public boolean equals(Object obj) {
	if ((obj != null) && (obj instanceof Integer)) {
	    return value == ((Integer)obj).intValue();
	}
	return false;
    }

    /**
     * Gets an Integer property. If the property does not
     * exist, it will return 0.
     * @param nm the property name
     */
    public static Integer getInteger(String nm) {
	return getInteger(nm, null);
    }

    /**
     * Gets an Integer property. If the property does not
     * exist, it will return val. Deals with Hexadecimal
     * and octal numbers.
     * @param nm the String name
     * @param val the Integer value
     */
    public static Integer getInteger(String nm, int val) {
        Integer result = getInteger(nm, null);
        return (result == null) ? new Integer(val) : result;
    }

    /**
     * Gets an Integer property. If the property does not
     * exist, it will return val. Deals with Hexadecimal
     * and octal numbers.
     * @param nm the property name
     * @param val the integer value
     */
    public static Integer getInteger(String nm, Integer val) {
	String v = System.getProperty(nm);
	if (v != null) {
	    try {
		if (v.startsWith("0x")) {
		    return Integer.valueOf(v.substring(2), 16);
		}
		if (v.startsWith("#")) {
		    return Integer.valueOf(v.substring(1), 16);
		}
		if (v.startsWith("0")) {
		    return Integer.valueOf(v.substring(1), 8);
		}
		return Integer.valueOf(v);
	    } catch (NumberFormatException e) {
	    }
	}	
	return val;
    }
}
public
class InternalError extends VirtualMachineError {
    /**
     * Constructs an InternalError with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public InternalError() {
	super();
    }

    /**
     * Constructs an InternalError with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public InternalError(String s) {
	super(s);
    }
}



public
class InterruptedException extends Exception {
    /**
     * Constructs an InterruptedException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public InterruptedException() {
	super();
    }

    /**
     * Constructs an InterruptedException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public InterruptedException(String s) {
	super(s);
    }
}

public
class LinkageError extends Error {
    /**
     * Constructs a LinkageError with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public LinkageError() {
	super();
    }

    /**
     * Constructs a LinkageError with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public LinkageError(String s) {
	super(s);
    }
}

public final
class Long extends Number {
    /**
     * The minimum value a Long can have.  The lowest minimum value that a
     * Long can have is 0x8000000000000000.
     */
    public static final long MIN_VALUE = 0x8000000000000000L;

    /**
     * The maximum value a Long can have.  The larget maximum value that a
     * Long can have is 0x7fffffffffffffff.
     */
    public static final long MAX_VALUE = 0x7fffffffffffffffL;

    /**
     * Returns a new String object representing the specified long in
     * the specified radix.
     * @param i		the long to be converted
     * @param radix	the radix
     * @see Character#MIN_RADIX
     * @see Character#MAX_RADIX
     */
    public static String toString(long i, int radix) {
	StringBuffer buf;
	int digitCount = 0;
	boolean minval = false;
	boolean negative = false;
	if (i == 0x8000000000000000L) {
            switch (radix) {
                case 2:  return "-1000000000000000000000000000000000000000000000000000000000000000";
                case 4:  return "-20000000000000000000000000000000";
                case 8:  return "-1000000000000000000000";
                case 16: return "-8000000000000000";
                default: 
                    minval = negative = true;
                    i = MAX_VALUE;
            }
	} else if (i < 0) {
	    i = -i;
	    negative = true;
	}
	buf = new StringBuffer(45);
	while (i > 0) {
	    if (i < radix) {
		buf.append(Character.forDigit((int)i, radix));
		i = 0;
	    } else {
		int j = (int)(i % radix);
		i /= radix;
		buf.append(Character.forDigit(j,radix));
	    }
	    digitCount++;
	}
	if (digitCount > 0) {
	    int j = buf.length();
	    int k = 0;
            int ii;
	    char tmp[];
	    if (negative) {
		tmp = new char[j + 1];
		tmp[0] = '-';
		k = 1;
	    } else {
		tmp = new char[j];
	    }
	    ii = 0;
	    while (j-- > 0) {
		tmp[j+k] = buf.charAt(ii++);
	    }
	    if (minval) {
		tmp[tmp.length-1]++;
	    }
	    return String.valueOf(tmp);
	} else
	    return "0";
    }

    /**
     * Returns a new String object representing the specified integer. The radix
     * is assumed to be 10.
     * @param i	the long to be converted
     */
    public static String toString(long i) {
	return toString(i, 10);
    }


    /**
     * Assuming the specified String represents a long, returns that long's
     * value. Throws an exception if the String cannot be parsed as a long.
     * @param s		the String containing the integer
     * @param radix 	the radix to be used
     * @exception	NumberFormatException If the String does not 
     *                  contain a parsable integer.
     */
    public static long parseLong(String s, int radix) 
              throws NumberFormatException 
   {
        if (s == null) {
            throw new NumberFormatException("null");
        }
	long result = 0;
	boolean negative = false;
	int i=0, max = s.length();
	if (max > 0) {
	    if (s.charAt(0) == '-') {
		negative = true;
		i++;
	    }
	    while (i < max) {
		int digit = Character.digit(s.charAt(i++),radix);
		if (digit < 0)
		    throw new NumberFormatException(s);
		result = result * radix + digit;
	    }
	} else
	    throw new NumberFormatException(s);
	if (negative)
	    return -result;
	else
	    return result;
    }


    /**
     * Assuming the specified String represents a long, return that long's
     * value. Throws an exception if the String cannot be parsed as a long.
     * The radix is assumed to be 10.
     * @param s		the String containing the long
     * @exception	NumberFormatException If the string does not contain
     *                   a parsable long.
     */
    public static long parseLong(String s) throws NumberFormatException {
	return parseLong(s, 10);
    }

    /**
     * Assuming the specified String represents a long, returns a new Long
     * object initialized to that value. Throws an exception if the String cannot be
     * parsed as a long.
     * @param s		the String containing the long.
     * @param radix 	the radix to be used
     * @exception	NumberFormatException If the String does not contain a parsable 
     *                                        long.
     */
    public static Long valueOf(String s, int radix) throws NumberFormatException {
	return new Long(parseLong(s, radix));
    }

    /**
     * Assuming the specified String represents a long, returns a new Long
     * object initialized to that value. Throws an exception if the String cannot be
     * parsed as a long. The radix is assumed to be 10.
     * @param s		the String containing the long
     * @exception	NumberFormatException If the String does not contain a parsable 
     *                                        long.
     */
    public static Long valueOf(String s) throws NumberFormatException 
    {
	return new Long(parseLong(s, 10));
    }


    /**
     * The value of the Long.
     */
    private long value;

    /**
     * Constructs a Long object initialized to the specified value.
     * @param value	the initial value of the Long
     */
    public Long(long value) {
	this.value = value;
    }

    /**
     * Constructs a Long object initialized to the value specified by the
     * String parameter.  The radix is assumed to be 10.
     * @param s		the String to be converted to a Long
     * @exception	NumberFormatException If the String does not contain a parsable 
     *                                        long.
     */
    public Long(String s) throws NumberFormatException {
	this.value = parseLong(s, 10);
    }

    /**
     * Returns the value of this Long as an int.
     */
    public int intValue() {
	return (int)value;
    }

    /**
     * Returns the value of this Long as a long.
     */
    public long longValue() {
	return (long)value;
    }

    /**
     * Returns the value of this Long as a float.
     */
    public float floatValue() {
	return (float)value;
    }

    /**
     * Returns the value of this Long as a double.
     */
    public double doubleValue() {
	return (double)value;
    }

    /**
     * Returns a String object representing this Long's value.
     */
    public String toString() {
	return String.valueOf(value);
    }

    /**
     * Computes a hashcode for this Long.
     */
    public int hashCode() {
	return (int)value;
    }

    /**
     * Compares this object against the specified object.
     * @param obj		the object to compare with
     * @return 		true if the objects are the same; false otherwise.
     */
    public boolean equals(Object obj) {
	if ((obj != null) && (obj instanceof Long)) {
	    return value == ((Long)obj).longValue();
	}
	return false;
    }

    /**
     * Get a Long property. If the property does not
     * exist, it will return 0.
     * @param nm the property name
     */
    public static Long getLong(String nm) {
	return getLong(nm, null);
    }

    /**
     * Get a Long property. If the property does not
     * exist, it will return val. Deals with Hexadecimal and octal numbers.
     * @param nm the String name
     * @param val the Long value
     */
    public static Long getLong(String nm, long val) {
        Long result = Long.getLong(nm, null);
        return (result == null) ? new Long(val) : result;
    }

    /**
     * Get a Long property. If the property does not
     * exist, it will return val. Deals with Hexadecimal and octal numbers.
     * @param nm the property name
     * @param val the Long value
     */
    public static Long getLong(String nm, Long val) {
	String v = System.getProperty(nm);
	if (v != null) {
	    try {
		if (v.startsWith("0x")) {
		    return Long.valueOf(v.substring(2), 16);
		}
		if (v.startsWith("#")) {
		    return Long.valueOf(v.substring(1), 16);
		}
		if (v.startsWith("0")) {
		    return Long.valueOf(v.substring(1), 8);
		}
		return Long.valueOf(v);
	    } catch (NumberFormatException e) {
	    }
	}	
	return val;
    }
}


public final
class Math {
    /**
     * Don't let anyone instantiate this class.
     */
    private Math() {}

    /**
     * The float representation of the value E.  E is equivalent to
     * 2.7182818284590452354f in Java.
     */
    public static final double E = 2.7182818284590452354;

    /**
     * The float representation of the value Pi.  Pi is equivalent
     * to 3.14159265358979323846f in Java.
     */
    public static final double PI = 3.14159265358979323846;


    /**
     * Returns the trigonometric sine of an angle.
     * @param a an assigned angle that is measured in radians
     */
    public static native double sin(double a);
    
    /**
     * Returns the trigonometric cosine of an angle.
     * @param a an assigned angle that is measured in radians
     */
    public static native double cos(double a);
   
    /**
     * Returns the trigonometric tangent of an angle.
     * @param a an assigned angle that is measured in radians 
     */
    public static native double tan(double a);

    /**
     * Returns the arc sine of a, in the range of -Pi/2 through Pi/2.
     * @param a (-1.0) <= a <= 1.0 
     */
    public static native double asin(double a);

    /**
     * Returns the arc cosine of a, in the range of 0.0 through Pi.
     * @param a (-1.0) <= a <= 1.0
     */
    public static native double acos(double a); 

    /**
     * Returns the arc tangent of a, in the range of -Pi/2 through Pi/2.
     * @param a an assigned value
     * @return the arc tangent of a.
     */
    public static native double atan(double a);

    /**
     * Returns the exponential number e(2.718...) raised to the power of a.
     * @param a an assigned value
     */
    public static native double exp(double a);

    /**
     * Returns the natural logarithm (base e) of a.
     * @param a a is a number greater than  0.0 
     * @exception ArithmeticException If a is less than 0.0 .
     */
    public static native double log(double a) throws ArithmeticException;

    /**
     * Returns the square root of a.
     * @param a a is a number greater than or equal to 0.0 
     * @exception ArithmeticException If a is a value less than 0.0 .
     */
    public static native double sqrt(double a) throws ArithmeticException;

    /**
     * Returns the remainder of f1 divided by f2 as defined by IEEE 754.
     * @param f1 the dividend
     * @param f2 the divisor
     */
    public static native double IEEEremainder(double f1, double f2);

    /**
     * Returns the "ceiling" or smallest whole number greater than or equal to a.
     * @param a an assigned value
     */
    public static native double ceil(double a);

    /**
     * Returns the "floor" or largest whole number less than or equal to a.
     * @param a an assigned value
     */
    public static native double floor(double a);

    /**
     * Converts a double value into an integral value in double format.
     * @param a an assigned double value
     */
    public static native double rint(double a);

    /**
     * Converts rectangular coordinates (a, b) to polar (r, theta).  This method
     * computes the phase theta by computing an arc tangent of b/a in
     * the range of -Pi to Pi.
     * @param a an assigned value
     * @param b an assigned value
     * @return the polar coordinates (r, theta).
     */
    public static native double atan2(double a, double b);


    /**
     * Returns the number a raised to the power of b.  If (a == 0.0), then b 
     * must be greater than 0.0; otherwise you will throw an exception. 
     * An exception will also occur if (a <= 0.0) and b is not equal to a  
     * whole number.
     * @param a an assigned value with the exceptions: (a == 0.0) -> (b > 0.0)
     * && (a <= 0.0) -> (b == a whole number)
     * @param b an assigned value with the exceptions: (a == 0.0) -> (b > 0.0)
     * && (a <= 0.0) -> (b == a whole number)
     * @exception ArithmeticException If (a == 0.0) and (b <= 0.0) .
     * @exception ArithmeticException If (a <= 0.0) and b is not equal to 
     * a whole number.
     */
    public static native double pow(double a, double b) throws ArithmeticException;

    /**
     * Rounds off a float value by first adding 0.5 to it and then returning the
     * largest integer that is less than or equal to this new value. 
     * @param a the value to be rounded off
     */
    public static int round(float a) {
	return (int)floor(a + 0.5f);
    }

    /**
     * Rounds off a double value by first adding 0.5 to it and then returning the
     * largest integer that is less than or equal to this new value. 
     * @param a the value to be rounded off
     */
    public static long round(double a) {
	return (long)floor(a + 0.5d);
    }


    private static Random randomNumberGenerator;

    /**
     * Generates a random number between 0.0 and 1.0. <p>
     *
     * Random number generators are often referred to as pseudorandom number 
     * generators because the numbers produced tend to repeat themselves after
     * a period of time.  
     * @return a pseudorandom double between 0.0 and 1.0.
     */
    public static synchronized double random() {
        if (randomNumberGenerator == null)
            randomNumberGenerator = new Random();
        return randomNumberGenerator.nextDouble();
    }

    /**
     * Returns the absolute integer value of a.
     * @param a an assigned integer value
     */
    public static int abs(int a) {
	return (a < 0) ? -a : a;
    }

    /**
     * Returns the absolute long value of a.
     * @param a an assigned long value.
     */
    public static long abs(long a) {
	return (a < 0) ? -a : a;
    }

    /**
     * Returns the absolute float value of a.
     * @param a an assigned float value
     */
    public static float abs(float a) {
	return (a < 0) ? -a : a;
    }
  
    /**
     * Returns the absolute double value of a.
     * @param a an assigned double value
     */
    public static double abs(double a) {
	return (a < 0) ? -a : a;
    }

    /**
     * Takes two int values, a and b, and returns the greater number of the two. 
     * @param a an integer value to be compared
     * @param b an integer value to be compared
     */
    public static int max(int a, int b) {
	return (a >= b) ? a : b;
    }

    /**
     * Takes two long values, a and b, and returns the greater number of the two. 
     * @param a a long value to be compared
     * @param b a long value to be compared
     */
    public static long max(long a, long b) {
	return (a >= b) ? a : b;
    }

    /**
     * Takes two float values, a and b, and returns the greater number of the two. 
     * @param a a float value to be compared
     * @param b a float value to be compared
     */
    public static float max(float a, float b) {
        if (a != a) return a;	// a is NaN
	return (a >= b) ? a : b;
    }

    /**
     * Takes two double values, a and b, and returns the greater number of the two. 
     * @param a a double value to be compared
     * @param b a double value to be compared
     */
    public static double max(double a, double b) {
        if (a != a) return a;	// a is NaN
	return (a >= b) ? a : b;
    }

    /**
     * Takes two integer values, a and b, and returns the smallest number of the two. 
     * @param a an integer value to be compared
     * @param b an integer value to be compared
     */
    public static int min(int a, int b) {
	return (a <= b) ? a : b;
    }

    /**
     * Takes two long values, a and b, and returns the smallest number of the two. 
     * @param a a long value to be compared
     * @param b a long value to be compared
     */
    public static long min(long a, long b) {
	return (a <= b) ? a : b;
    }

    /**
     * Takes two float values, a and b, and returns the smallest number of the two. 
     * @param a a float value to be compared
     * @param b a float value to be compared
     */
    public static float min(float a, float b) {
        if (a != a) return a;	// a is NaN
	return (a <= b) ? a : b;
    }

    /**
     * Takes two double values, a and b, and returns the smallest number of the two. 
     * @param a a double value to be compared
     * @param b a double value to be compared
     */
    public static double min(double a, double b) {
        if (a != a) return a;	// a is NaN
	return (a <= b) ? a : b;
    }

}
public
class NegativeArraySizeException extends RuntimeException {
    /**
     * Constructs a NegativeArraySizeException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public NegativeArraySizeException() {
	super();
    }

    /**
     * Constructs a NegativeArraySizeException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public NegativeArraySizeException(String s) {
	super(s);
    }
}

public
class NoClassDefFoundError extends LinkageError {
    /**
     * Constructs a NoClassDefFoundError with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public NoClassDefFoundError() {
	super();
    }

    /**
     * Constructs a NoClassDefFoundError with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public NoClassDefFoundError(String s) {
	super(s);
    }
}
public
class NoSuchFieldError extends IncompatibleClassChangeError {
    /**
     * Constructs a NoSuchFieldException without a detail message.
     * A detail message is a String that describes this particular exception.
     */
    public NoSuchFieldError() {
	super();
    }

    /**
     * Constructs a NoSuchFieldException with a detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public NoSuchFieldError(String s) {
	super(s);
    }
}

public
class NoSuchMethodError extends IncompatibleClassChangeError {
    /*
     * Constructs a NoSuchMethodException without a detail message.
     * A detail message is a String that describes this particular exception.
     */
    public NoSuchMethodError() {
	super();
    }

    /**
     * Constructs a NoSuchMethodException with a detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public NoSuchMethodError(String s) {
	super(s);
    }
}

public
class NoSuchMethodException extends Exception {
    /**
     * Constructs a NoSuchMethodException without a detail message.
     * A detail message is a String that describes this particular exception.
     */
    public NoSuchMethodException() {
	super();
    }

    /**
     * Constructs a NoSuchMethodException with a detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public NoSuchMethodException(String s) {
	super(s);
    }
}

public
class NullPointerException extends RuntimeException {
    /**
     * Constructs a NullPointerException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public NullPointerException() {
	super();
    }

    /**
     * Constructs a NullPointerException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public NullPointerException(String s) {
	super(s);
    }
}

public abstract class Number {
    /**
     * Returns the value of the number as an int.
     * This may involve rounding if the number is not already an integer.
     */
    public abstract int intValue();

    /**
     * Returns the value of the number as a long.  This may involve rounding
     * if the number is not already a long.
     */
    public abstract long longValue();

    /**
     * Returns the value of the number as a float.  This may involve rounding
     * if the number is not already a float.
     */
    public abstract float floatValue();

    /**
     * Returns the value of the number as a double.  This may involve rounding
     * if the number is not already a double.
     */
    public abstract double doubleValue();
}
public
class NumberFormatException extends IllegalArgumentException {
    /**
     * Constructs a NumberFormatException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public NumberFormatException () {
	super();
    }

    /**
     * Constructs a NumberFormatException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s	the detail message
     */
    public NumberFormatException (String s) {
	super (s);
    }
}

public class Object {
    /**
     * Returns the Class of this Object. Java has a runtime
     * representation for classes- a descriptor of type Class- 
     * which the method getClass() returns for any Object.
     */
    public final native Class getClass();

    /**
     * Returns a hashcode for this Object.
     * Each Object in the Java system has a hashcode. The hashcode
     * is a number that is usually different for different Objects.
     * It is used when storing Objects in hashtables.
     * Note: hashcodes can be negative as well as positive.
     * @see		java.util.Hashtable
     */
    public native int hashCode();

    /**
     * Compares two Objects for equality.
     * Returns a boolean that indicates whether this Object is equivalent 
     * to the specified Object. This method is used when an Object is stored
     * in a hashtable.
     * @param	obj	the Object to compare with
     * @return	true if these Objects are equal; false otherwise.
     * @see		java.util.Hashtable
     */
    public boolean equals(Object obj) {
	return (this == obj);
    }

    /**
     * Creates a clone of the object. A new instance is allocated and a 
     * bitwise clone of the current object is place in the new object.
     * @return		a clone of this Object.
     * @exception	OutOfMemoryError If there is not enough memory.
     * @exception	CloneNotSupportedException Object explicitly does not
     *                      want to be cloned, or it does not support the
     *                      Cloneable interface.
     */
    protected native Object clone() throws CloneNotSupportedException;

    /**
     * Returns a String that represents the value of this Object.  It is recommended
     * that all subclasses override this method.
     */
    public String toString() {
	return getClass().getName() + "@" + 
                     Integer.toString(hashCode() << 1 >>> 1, 16);
    }

    /**
     * Notifies a single waiting thread on a change in condition of another thread. 
     * The thread effecting the change notifies the waiting thread
     * using notify(). Threads that want to wait for a condition to 
     * change before proceeding can call wait(). <p>
     * <em>The method notify() can only be called from within a synchronized method.</em>
     *
     * @exception	IllegalMonitorStateException If the current thread
     *			    is not the owner of the Object's monitor.
     * @see		Object#wait
     * @see		Object#notifyAll
     */
    public final native void notify();

    /**
     * Notifies all of the threads waiting for a condition to change.
     * Threads that are waiting are generally waiting for another thread to 
     * change some condition. Thus, the thread effecting a change that more 
     * than one thread is waiting for notifies all the waiting threads using
     * the method notifyAll(). Threads that want to wait for a condition to 
     * change before proceeding can call wait(). <p>
     * <em>The method notifyAll() can only be called from within a synchronized method.</em>
     *
     * @exception	IllegalMonitorStateException If the current thread
     * 			    is not the owner of the Object's monitor.
     * @see		Object#wait
     * @see		Object#notify
     */
    public final native void notifyAll();

    /**
     * Causes a thread to wait until it is notified or the specified timeout
     * expires. <p>
     * <em>The method wait() can only be called from within a synchronized method.</em>
     *
     * @param timeout	the maximum time to wait in milliseconds
     * @exception	IllegalMonitorStateException If the current thread
     *			    is not the owner of the Object's monitor.
     * @exception 	InterruptedException Another thread has interrupted
     *			    this thread. 
     */
    public final native void wait(long timeout) throws InterruptedException;

    /**
     * More accurate wait.
     * <em>The method wait() can only be called from within a synchronized method.</em>
     *
     * @param timeout	the maximum time to wait in milliseconds
     * @param nano      additional time, in nanoseconds range 0-999999
     * @exception	IllegalMonitorStateException If the current thread
     *			    is not the owner of the Object's monitor.
     * @exception 	InterruptedException Another thread has interrupted
     *			    this thread. 
     */
    public final void wait(long timeout, int nanos) throws InterruptedException {
	if (nanos >= 500000 || (nanos != 0 && timeout==0))
	    timeout++;
	wait(timeout);
    }

    /**
     * Causes a thread to wait forever until it is notified. <p>
     * <em>The method wait() can only be called from within a synchronized method</em>
     *
     * @exception	IllegalMonitorStateException If the current thread
     *			    is not the owner of the Object's monitor.
     * @exception 	InterruptedException Another thread has interrupted
     *			    this thread. 
     */
    public final void wait() throws InterruptedException {
	wait(0);
    }

    /**
     * Code to perform when this object is garbage collected.  
     * The default is that nothing needs to be performed.
     * 
     * Any exception thrown by a finalize method causes the finalization to
     * halt.  But otherwise, it is ignored.
     */
    protected void finalize() throws Throwable { }
}

public
class OutOfMemoryError extends VirtualMachineError {
    /**
     * Constructs an OutOfMemoryError with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public OutOfMemoryError() {
	super();
    }

    /**
     * Constructs an OutOfMemoryError with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public OutOfMemoryError(String s) {
	super(s);
    }
}




public abstract class Process 
{
    /**
     * Returns a Stream connected to the input of the child process. 
     * This stream is traditionally buffered.
     */
    abstract public OutputStream getOutputStream();
    

    /** 
     * Returns a Stream connected to the output of the child process. 
     * This stream is traditionally buffered. 
     */
    abstract public InputStream getInputStream();

    /**
     * Returns the an InputStream connected to the error stream of the child process. 
     * This stream is traditionally unbuffered.
     */
    abstract public InputStream getErrorStream();

    /**
     * Waits for the subprocess to complete.  If the subprocess has
     * already terminated, the exit value is simply returned.  If the
     * subprocess has not yet terminated the calling thread will be
     * blocked until the subprocess exits.
     *
     * @exception InterruptedException 
     *            Another thread has interrupted this thread. 
     */
    abstract public int waitFor() throws InterruptedException;

   /**
    * Returns the exit value for the subprocess.
    * @exception IllegalThreadStateException If the subprocess has not yet
    * terminated.
    */
    abstract public int exitValue();

   /**
    * Kills the subprocess.
    */
    abstract public void destroy();
}
public
interface Runnable {
    /**
     * The method that is executed when a Runnable object is activated.  The run() method
     * is the "soul" of a Thread.  It is in this method that all of the action of a 
     * Thread takes place.
     * @see Thread#run
     */
    public abstract void run();
}



public class Runtime {
    private static Runtime currentRuntime = new Runtime();
      

    /**
     * Returns the runtime.
     */
    public static Runtime getRuntime() { 
	return currentRuntime;
    }
    
    /** Don't let anyone else instantiate this class */
    private Runtime() {}

    /* Helper for exit
     */
    private native void exitInternal(int status);

    /**
     * Exits the virtual machine with an exit code. This method does
     * not return, use with caution.
     * @param status exit status, 0 if successful, other values indicate
     *        various error types. 
     */
    public void exit(int status) {
	SecurityManager security = System.getSecurityManager();
	if (security != null) {
	    security.checkExit(status);
	}
	exitInternal(status);
    }

    /* Helper for exec
     */
    private native Process execInternal(String cmdarray[], String envp[]) 
	 throws IOException;

    /**
     * Executes the system command specified in the parameter.
     * Returns a Process which has methods for optaining the stdin,
     * stdout, and stderr of the subprocess.  This method fails if
     * executed by untrusted code.
     *
     * @param command a specified system command
     * @return an instance of class Process
     */
    public Process exec(String command) throws IOException {
	return exec(command, null);
    }

    /**
     * Executes the system command specified in the parameter.
     * Returns a Process which has methods for optaining the stdin,
     * stdout, and stderr of the subprocess.  This method fails if
     * executed by untrusted code.
     *
     * @param command a specified system command
     * @return an instance of class Process
     */
    public Process exec(String command, String envp[]) throws IOException {
	int count = 0;
	String cmdarray[];
 	StringTokenizer st;

	st = new StringTokenizer(command);
 	count = st.countTokens();

	cmdarray = new String[count];
	st = new StringTokenizer(command);
	count = 0;
 	while (st.hasMoreTokens()) {
 		cmdarray[count++] = st.nextToken();
 	}
	SecurityManager security = System.getSecurityManager();
	if (security != null) {
	    security.checkExec(cmdarray[0]);
	}
	return execInternal(cmdarray, envp);
    }

    /**
     * Executes the system command specified by cmdarray[0] with arguments
     * specified by the strings in the rest of the array.
     * Returns a Process which has methods for optaining the stdin,
     * stdout, and stderr of the subprocess.  This method fails if
     * executed by untrusted code.
     *
     * @param an array containing the command to call and its arguments
     * @param envp array containing environment in format name=value
     * @return an instance of class Process
     */

    public Process exec(String cmdarray[]) throws IOException {
	return exec(cmdarray, null);
    }

    /**
     * Executes the system command specified by cmdarray[0] with arguments
     * specified by the strings in the rest of the array.
     * Returns a Process which has methods for optaining the stdin,
     * stdout, and stderr of the subprocess.  This method fails if
     * executed by untrusted code.
     *
     * @param an array containing the command to call and its arguments
     * @param envp array containing environment in format name=value
     * @return an instance of class Process
     */

    public Process exec(String cmdarray[], String envp[]) throws IOException {
	SecurityManager security = System.getSecurityManager();
	if (security != null) {
	    security.checkExec(cmdarray[0]);
	}
	return execInternal(cmdarray, envp);
    }


    /**
     * Returns the number of free bytes in system memory. This number
     * is not always accurate because it is just an estimation of the available
     * memory.  More memory may be freed by calling System.gc() .
     */
    public native long freeMemory();

    /**
     * Returns the total number of bytes in system memory. 
     */
    public native long totalMemory();

    /**
     * Runs the garbage collector.
     */
    public native void gc();

    /**
     * Runs the finalization methods of any objects pending finalization.
     * Usually you will not need to call this method since finalization
     * methods will be called asynchronously by the finalization thread.
     * However, under some circumstances (like running out of a finalized
     * resource) it can be useful to run finalization methods synchronously.
     */
    public native void runFinalization();

    /**
     * Enables/Disables tracing of instructions.
     * @param on	start tracing if true
     */
    public native void traceInstructions(boolean on);

    /**
     * Enables/Disables tracing of method calls.
     * @param on	start tracing if true
     */
    public native void traceMethodCalls(boolean on);

    /**
     * Initializes the linker and returns the search path for shared libraries.
     */
    private synchronized native String initializeLinkerInternal();
    private native String buildLibName(String pathname, String filename);

    /* Helper for load and loadLibrary */
    private native boolean loadFileInternal(String filename);


    /** The paths searched for libraries */
    private String paths[];

    private void initializeLinker() {
	String ldpath = initializeLinkerInternal();
	char c = System.getProperty("path.separator").charAt(0);
	int ldlen = ldpath.length();
	int i, j, n;
	// Count the separators in the path
	i = ldpath.indexOf(c);
	n = 0;
	while (i >= 0) {
	    n++;
	    i = ldpath.indexOf(c, i+1);
	}

	// allocate the array of paths - n :'s = n + 1 path elements
	paths = new String[n + 1];

	// Fill the array with paths from the ldpath
	n = i = 0;
	j = ldpath.indexOf(c);
	while (j >= 0) {
	    if (j - i > 0) {
		paths[n++] = ldpath.substring(i, j);
	    }
	    i = j + 1;
	    j = ldpath.indexOf(c, i);
	}
	paths[n] = ldpath.substring(i, ldlen);
    }
    

    /**
     * Loads a dynamic library, given a complete path name. If you use this
     * from java_g it will automagically insert "_g" before the ".so".
     *
     * Example: <code>Runtime.getRuntime().load("/home/avh/lib/libX11.so");</code>
     * @param filename the file to load
     * @exception UnsatisfiedLinkError If the file does not exist.
     * @see #getRuntime
     */
    public synchronized void load(String filename) {
	SecurityManager security = System.getSecurityManager();
	if (security != null) {
	    security.checkLink(filename);
	}
        if (!loadFileInternal(filename)) {
	    throw new UnsatisfiedLinkError(filename);
	}
    }

    /**
     * Loads a dynamic library with the specified library name. The 
     * call to LoadLibrary() should be made in the static 
     * initializer of the first class that is loaded. Linking in the 
     * same library more than once is ignored.
     * @param libname the name of the library
     * @exception UnsatisfiedLinkError If the library does not exist. 
     */
    public synchronized void loadLibrary(String libname) {
	SecurityManager security = System.getSecurityManager();
	if (security != null) {
	    security.checkLink(libname);
	}
        if (paths == null) {
            initializeLinker();
	}
	for (int i = 0 ; i < paths.length ; i++) {
	    String tempname = buildLibName(paths[i], libname);
	    if (loadFileInternal(tempname)) {
	        return;
	    }
	}
	// Oops, it failed
        throw new UnsatisfiedLinkError("no " + libname + 
					   " in shared library path");
    }

    /**
     * Localize an input stream. A localized input stream will automatically
     * translate the input from the local format to UNICODE. 
     */
    public InputStream getLocalizedInputStream(InputStream in) {
	return in;
    }

    /**
     * Localize an output stream. A localized output stream will automatically
     * translate the output from UNICODE to the local format.
     */
    public OutputStream getLocalizedOutputStream(OutputStream out) {
	return out;
    }
}
public
class RuntimeException extends Exception {
    /**
     * Constructs a RuntimeException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public RuntimeException() {
	super();
    }

    /**
     * Constructs a RuntimeException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public RuntimeException(String s) {
	super(s);
    }
}
public class SecurityException extends RuntimeException {
    /**
     * Constructs a SecurityException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public SecurityException() {
	super();
    }

    /**
     * Constructs a SecurityException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public SecurityException(String s) {
	super(s);
    }
}

public abstract
class SecurityManager {
    protected boolean inCheck;

    /** 
     * Returns whether there is a security check in progress.
     */
    public boolean getInCheck() {
	return inCheck;
    }

    /**
     * Constructs a new SecurityManager.
     * @exception SecurityException If the security manager cannot be
     * created.
     */
    protected SecurityManager() {
	if (System.getSecurityManager() != null) {
	    throw new SecurityException("can't create SecurityManager");
	}
    }
    
    /**
     * Gets the context of this Class.  
     */
    protected native Class[] getClassContext();

    /**
     * The current ClassLoader on the execution stack.
     */
    protected native ClassLoader currentClassLoader();

    /**
     * Return the position of the stack frame containing the
     * first occurrence of the named class.
     * @param name classname of the class to search for
     */
    protected native int classDepth(String name);

    /**
     * 
     */
    protected native int classLoaderDepth();

    /**
     * Returns true if the specified String is in this Class. 
     * @param name the name of the class
     */
    protected boolean inClass(String name) {
	return classDepth(name) >= 0;
    }

    /**
     * Returns a boolean indicating whether or not the current ClassLoader
     * is equal to null.
     */
    protected boolean inClassLoader() {
	return currentClassLoader() != null;
    }

    /**
     * Returns an implementation-dependent Object which encapsulates
     * enough information about the current execution environment
     * to perform some of the security checks later.
     */
    public Object getSecurityContext() {
	return null;
    }

    /**
     * Checks to see if the ClassLoader has been created.
     * @exception SecurityException If a security error has occurred.
     */
    public void checkCreateClassLoader() {
	throw new SecurityException();
    }
    
    /**
     * Checks to see if the specified Thread is allowed to modify
     * the Thread group.
     * @param g the Thread to be checked
     * @exception SecurityException If the current Thread is not
     * allowed to access this Thread group.
     */
    public void checkAccess(Thread g) {
	throw new SecurityException();
    }

    /**
     * Checks to see if the specified Thread group is allowed to 
     * modify this group.
     * @param g the Thread group to be checked
     * @exception  SecurityException If the current Thread group is 
     * not allowed to access this Thread group.
     */
    public void checkAccess(ThreadGroup g) {
	throw new SecurityException();
    }

    /**
     * Checks to see if the system has exited the virtual 
     * machine with an exit code.
     * @param status exit status, 0 if successful, other values
     * indicate various error types.
     * @exception  SecurityException If a security error has occurred.
     */
    public void checkExit(int status) {
	throw new SecurityException();
    }

    /**
     * Checks to see if the system command is executed by 
     * trusted code.
     * @param cmd the specified system command
     * @exception  SecurityException If a security error has occurred.
     */
    public void checkExec(String cmd) {
	throw new SecurityException();
    }

    /**
     * Checks to see if the specified linked library exists.
     * @param lib the name of the library
     * @exception  SecurityException If the library does not exist.
     */
    public void checkLink(String lib) {
	throw new SecurityException();
    }

    /**
     * Checks to see if an input file with the specified
     * file descriptor object gets created.
     * @param fd the system dependent file descriptor
     * @exception  SecurityException If a security error has occurred.
     */
    public void checkRead(FileDescriptor fd) {
	throw new SecurityException();
    }

    /**
     * Checks to see if an input file with the specified system dependent
     * file name gets created.
     * @param file the system dependent file name
     * @exception  SecurityException If the file is not found.
     */
    public void checkRead(String file) {
	throw new SecurityException();
    }

    /**
     * Checks to see if the current context or the indicated context are
     * both allowed to read the given file name.
     * @param file the system dependent file name
     * @param context the alternate execution context which must also
     * be checked
     * @exception  SecurityException If the file is not found.
     */
    public void checkRead(String file, Object context) {
	throw new SecurityException();
    }

    /**
     * Checks to see if an output file with the specified 
     * file descriptor object gets created.
     * @param fd the system dependent file descriptor
     * @exception  SecurityException If a security error has occurred.
     */
    public void checkWrite(FileDescriptor fd) {
	throw new SecurityException();
    }

    /**
     * Checks to see if an output file with the specified system dependent
     * file name gets created.
     * @param file the system dependent file name
     * @exception  SecurityException If the file is not found.
     */
    public void checkWrite(String file) {
	throw new SecurityException();
    }

    /**
     * Checks to see if a file with the specified system dependent
     * file name can be deleted.
     * @param file the system dependent file name
     * @exception  SecurityException If the file is not found.
     */
    public void checkDelete(String file) {
	throw new SecurityException();
    }

    /**
     * Checks to see if a socket has connected to the specified port on the
     * the specified host.
     * @param host the host name port to connect to
     * @param port the protocol port to connect to
     * @exception  SecurityException If a security error has occurred.
     */
    public void checkConnect(String host, int port) {
	throw new SecurityException();
    }

    /**
     * Checks to see if the current execution context and the indicated
     * execution context are both allowed to connect to the indicated
     * host and port.
     */
    public void checkConnect(String host, int port, Object context) {
	throw new SecurityException();
    }

    /**
     * Checks to see if a server socket is listening to the specified local
     * port that it is bounded to.
     * @param port the protocol port to connect to
     * @exception  SecurityException If a security error has occurred.
     */
    public void checkListen(int port) {
	throw new SecurityException();
    }

    /**
     * Checks to see if a socket connection to the specified port on the 
     * specified host has been accepted.
     * @param host the host name to connect to
     * @param port the protocol port to connect to
     * @exception  SecurityException If a security error has occurred.
     */
    public void checkAccept(String host, int port) {
	throw new SecurityException();
    }

    /**
     * Checks to see who has access to the System properties.
     * @exception  SecurityException If a security error has occurred.
     */
    public void checkPropertiesAccess() {
	throw new SecurityException();
    }

    /**
     * Checks to see who has access to the System property named by <i>key</i>.
     * @param key the System property that the caller wants to examine
     * @exception  SecurityException If a security error has occurred.
     */
    public void checkPropertyAccess(String key) {
	throw new SecurityException();
    }

    /**
     * Checks to see who has access to the System property named by <i>key</i>
     * and <i>def</i>.
     * @param key the System property that the caller wants to examine
     * @param def default value to return if this property is not defined
     * @exception  SecurityException If a security error has occurred.
     */
    public void checkPropertyAccess(String key, String def) {
	throw new SecurityException();
    }

    /**
     * Checks to see if top-level windows can be created by the
     * caller. A return of false means that the window creation is
     * allowed but the window should indicate some sort of visual
     * warning. Returning true means the creation is allowed with no
     * special restrictions. To disallow the creation entirely, this
     * method should throw a SecurityException.
     * @param window the new window that's being created.
     */
    public boolean checkTopLevelWindow(Object window) {
	return false;
    }

    /**
     * Checks to see if an applet can access a package.
     */
    public void checkPackageAccess(String pkg) {
	throw new SecurityException();
    }

    /**
     * Checks to see if an applet can define classes in a package.
     */
    public void checkPackageDefinition(String pkg) {
	throw new SecurityException();
    }

    /**
     * Checks to see if an applet can set a networking-related object factory.
     */
    public void checkSetFactory() {
	throw new SecurityException();
    }
}	
public
class StackOverflowError extends VirtualMachineError {
    /**
     * Constructs a StackOverflowError with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public StackOverflowError() {
	super();
    }

    /**
     * Constructs a StackOverflowError with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public StackOverflowError(String s) {
	super(s);
    }
}

public final
class String {
    /** The value is used for character storage. */
    private char value[];

    /** The offset is the first index of the storage that is used. */
    private int offset;

    /** The count is the number of characters in the String. */
    private int count;

    /**
     * Constructs a new empty String.
     */
    public String() {
	value = new char[0];
    }

    /**
     * Constructs a new String that is a copy of the specified String.
     * @param value the initial value of the String
     */
    public String(String value) {
	count = value.length();
	this.value = new char[count];
	value.getChars(0, count, this.value, 0);
    }

    /**
     * Constructs a new String whose initial value is the specified array 
     * of characters.
     * @param value the initial value of the String
     */
    public String(char value[]) {
	this.count = value.length;
	this.value = new char[count];
	System.arraycopy(value, 0, this.value, 0, count);
    }

    /**
     * Constructs a new String whose initial value is the specified sub array of characters.
     * The length of the new string will be count characters
     * starting at offset within the specified character array.
     * @param value	the initial value of the String, an array of characters
     * @param offset	the offset into the value of the String
     * @param count 	the length of the value of the String
     * @exception StringIndexOutOfBoundsException If the offset and count arguments are invalid.
     */
    public String(char value[], int offset, int count) {
	if (offset < 0) {
	    throw new StringIndexOutOfBoundsException(offset);
	}
	if (count < 0) {
	    throw new StringIndexOutOfBoundsException(count);
	}
	if (offset + count > value.length) {
	    throw new StringIndexOutOfBoundsException(offset + count);
	}

	this.value = new char[count];
	this.count = count;
	System.arraycopy(value, offset, this.value, 0, count);
    }

    /**
     * Constructs a new String whose initial value is the specified sub array of bytes.
     * The high-byte of each character can be specified, it should usually be 0.
     * The length of the new String will be count characters
     * starting at offset within the specified character array.  
     * @param ascii	the bytes that will be converted to characters
     * @param hibyte	the high byte of each Unicode character
     * @param offset	the offset into the ascii array
     * @param count 	the length of the String
     * @exception StringIndexOutOfBoundsException If the offset and count arguments are invalid.
     */
    public String(byte ascii[], int hibyte, int offset, int count) {
	if (offset < 0) {
	    throw new StringIndexOutOfBoundsException(offset);
	}
	if (count < 0) {
	    throw new StringIndexOutOfBoundsException(count);
	}
	if (offset + count > ascii.length) {
	    throw new StringIndexOutOfBoundsException(offset + count);
	}

	char value[] = new char[count];
	this.count = count;
	this.value = value;

	if (hibyte == 0) {
	    for (int i = count ; i-- > 0 ;) {
		value[i] = (char) (ascii[i + offset] & 0xff);
	    }
	} else {
	    hibyte <<= 8;
	    for (int i = count ; i-- > 0 ;) {
		value[i] = (char) (hibyte | (ascii[i + offset] & 0xff));
	    }
	}
    }

    /**
     * Constructs a new String whose value is the specified array of bytes.
     * The byte array transformed into Unicode chars using hibyte
     * as the upper byte of each character.
     * @param ascii	the byte that will be converted to characters
     * @param hibyte	the top 8 bits of each 16 bit Unicode character
     */
    public String(byte ascii[], int hibyte) {
	this(ascii, hibyte, 0, ascii.length);
    }

     
    /**
     * Construct a new string whose value is the current contents of the
     * given string buffer
     * @param buffer     the stringbuffer to be converted
     */
    public String (StringBuffer buffer) { 
	synchronized(buffer) { 
	    buffer.setShared();
	    this.value = buffer.getValue();
	    this.offset = 0;
	    this.count = buffer.length();
	}
    }
    

    /**
     * Returns the length of the String.
     * The length of the String is equal to the number of 16 bit
     * Unicode characters in the String.
     */
    public int length() {
	return count;
    }

    /**
     * Returns the character at the specified index. An index ranges
     * from <tt>0</tt> to <tt>length() - 1</tt>.
     * @param index	the index of the desired character
     * @exception	StringIndexOutOfBoundsException If the index is not
     *			in the range <tt>0</tt> to <tt>length()-1</tt>.
     */
    public char charAt(int index) {
	if ((index < 0) || (index >= count)) {
	    throw new StringIndexOutOfBoundsException(index);
	}
	return value[index + offset];
    }

    /**
     * Copies characters from this String into the specified character array.
     * The characters of the specified substring (determined by
     * srcBegin and srcEnd) are copied into the character array,
     * starting at the array's dstBegin location.
     * @param srcBegin	index of the first character in the string
     * @param srcEnd	end of the characters that are copied
     * @param dst		the destination array
     * @param dstBegin	the start offset in the destination array
     */
    public void getChars(int srcBegin, int srcEnd, char dst[], int dstBegin) {
	System.arraycopy(value, offset + srcBegin, dst, dstBegin, srcEnd - srcBegin);
    }

    /**
     * Copies characters from this String into the specified byte array.
     * Copies the characters of the specified substring (determined by
     * srcBegin and srcEnd) into the byte array, starting at the
     * array's dstBegin location.
     * @param srcBegin	index of the first character in the String
     * @param srcEnd	end of the characters that are copied
     * @param dst		the destination array
     * @param dstBegin	the start offset in the destination array
     */
    public void getBytes(int srcBegin, int srcEnd, byte dst[], int dstBegin) {
	int j = dstBegin;
	int n = offset + srcEnd;
	int i = offset + srcBegin;
	while (i < n) {
	    dst[j++] = (byte)value[i++];
	}
    }

    /**
     * Compares this String to the specified object.
     * Returns true if the object is equal to this String; that is,
     * has the same length and the same characters in the same sequence.
     * @param anObject	the object to compare this String against
     * @return 	true if the Strings are equal; false otherwise.
     */
    public boolean equals(Object anObject) {
	if ((anObject != null) && (anObject instanceof String)) {
	    String anotherString = (String)anObject;
	    int n = count;
	    if (n == anotherString.count) {
		char v1[] = value;
		char v2[] = anotherString.value;;
		int i = offset;
		int j = anotherString.offset;
		while (n-- != 0) {
		    if (v1[i++] != v2[j++]) {
			return false;
		    }
		}
		return true;
	    }
	}
	return false;
    }

    /**
     * Compares this String to another object.
     * Returns true if the object is equal to this String; that is,
     * has the same length and the same characters in the same sequence.
     * Upper case characters are folded to lower case before
     * they are compared.
     * @param anotherString	the String to compare this String against
     * @return 	true if the Strings are equal, ignoring case; false otherwise.
     */
    public boolean equalsIgnoreCase(String anotherString) {
	return (anotherString != null) && (anotherString.count == count) &&
		regionMatches(true, 0, anotherString, 0, count);
    }

    /**
     * Compares this String to another specified String.
     * Returns an integer that is less than, equal to, or greater than zero.
     * The integer's value depends on whether this String is less than, equal to, or greater
     * than anotherString.
     * @param anotherString the String to be compared
     */
    public int compareTo(String anotherString) {
	int len1 = count;
	int len2 = anotherString.count;
	int n = Math.min(len1, len2);
	char v1[] = value;
	char v2[] = anotherString.value;
	int i = offset;
	int j = anotherString.offset;

	while (n-- != 0) {
	    char c1 = v1[i++];
	    char c2 = v2[j++];
	    if (c1 != c2) {
		return c1 - c2;
	    }
	}
	return len1 - len2;
    }

    /**
     * Determines whether a region of this String matches the specified region
     * of the specified String.
     * @param toffset	where to start looking in this String
     * @param other     the other String
     * @param ooffset	where to start looking in the other String
     * @param len       the number of characters to compare
     * @return          true if the region matches with the other; false otherwise.
     */
    public boolean regionMatches(int toffset, String other, int ooffset, int len) {
	char ta[] = value;
	int to = offset + toffset;
	int tlim = offset + count;
	char pa[] = other.value;
	int po = other.offset + ooffset;
	int plim = po + other.count;
	if ((ooffset < 0) || (toffset < 0) || (to + len > tlim) || (po + len > plim)) {
	    return false;
	}
	while (--len >= 0) {
	    if (ta[to++] != pa[po++]) {
	        return false;
	    }
	}
	return true;
    }

    /**
     * Determines whether a region of this String matches the specified region
     * of the specified String.  If the boolean ignoreCase is true, upper case characters are 
     * considered equivalent to lower case letters.
     * @param ignoreCase if true, case is ignored
     * @param toffset	where to start looking in this String
     * @param other     the other String
     * @param ooffset	where to start looking in the other String
     * @param len       the number of characters to compare
     * @return          true if the region matches with the other; false otherwise.
     */
    public boolean regionMatches(boolean ignoreCase,
				         int toffset,
			               String other, int ooffset, int len) {
	char ta[] = value;
	int to = offset + toffset;
	int tlim = offset + count;
	char pa[] = other.value;
	char trt[] = Character.upCase;
	int po = other.offset + ooffset;
	int plim = po + other.count;
	if ((ooffset < 0) || (toffset < 0) || (to + len > tlim) || (po + len > plim)) {
	    return false;
	}
	while (--len >= 0) {
	    int c1 = ta[to++];
	    int c2 = pa[po++];
	    if ((c1 != c2)
		    && (!ignoreCase ||
			(c1 > 256) || (c2 > 256) ||
			(trt[c1] != trt[c2]))) {
		return false;
	    }
	}
	return true;
    }

    /**
     * Determines whether this String starts with some prefix.
     * @param prefix	the prefix
     * @param toffset	where to begin looking in the the String
     * @return 		true if the String starts with the specified prefix; false otherwise.
     */
    public boolean startsWith(String prefix, int toffset) {
	char ta[] = value;
	int to = offset + toffset;
	int tlim = offset + count;
	char pa[] = prefix.value;
	int po = prefix.offset;
	int pc = prefix.count;
	int plim = po + pc;
	if ((toffset < 0) || (to + pc > tlim)) {
	    return false;
	}
	while (--pc >= 0) {
	    if (ta[to++] != pa[po++]) {
	        return false;
	    }
	}
	return true;
    }

    /**
     * Determines whether this String starts with some prefix.
     * @param prefix	the prefix
     * @return 		true if the String starts with the specified prefix; false otherwise. 
     */
    public boolean startsWith(String prefix) {
	return startsWith(prefix, 0);
    }

    /**
     * Determines whether the String ends with some suffix.
     * @param suffix	the suffix
     * @return 		true if the String ends with the specified suffix; false otherwise.
     */
    public boolean endsWith(String suffix) {
	return startsWith(suffix, count - suffix.count);
    }

    /**
     * Returns a hashcode for this String. This is a large
     * number composed of the character values in the String.
     */
    public int hashCode() {
	int h = 0;
	int off = offset;
	char val[] = value;
	int len = count;

	if (len < 16) {
	    for (int i = len ; i > 0; i--) {
		h = (h * 37) + val[off++];
	    }
	} else {
	    // only sample some characters
	    int skip = len / 8;
	    for (int i = len ; i > 0; i -= skip, off += skip) {
		h = (h * 39) + val[off];
	    }
	}
	return h;
    }

    /**
     * Returns the index within this String of the first occurrence of the specified 
     * character.  This method returns -1 if the index is not found.
     * @param ch	the character to search for
     */
    public int indexOf(int ch) {
	return indexOf(ch, 0);
    }

    /**
     * Returns the index within this String of the first occurrence of the specified 
     * character, starting the search at fromIndex.  This method 
     * returns -1 if the index is not found.
     * @param ch	the character to search for
     * @param fromIndex	the index to start the search from
     */
    public int indexOf(int ch, int fromIndex) {
	int max = offset + count;
	char v[] = value;

	for (int i = offset + fromIndex ; i < max ; i++) {
	    if (v[i] == ch) {
		return i - offset;
	    }
	}
	return -1;
    }

    /**
     * Returns the index within this String of the last occurrence of the specified character.
     * The String is searched backwards starting at the last character.
     * This method returns -1 if the index is not found.
     * @param ch	the character to search for
     */
    public int lastIndexOf(int ch) {
	return lastIndexOf(ch, count - 1);
    }

    /**
     * Returns the index within this String of the last occurrence of the specified character.
     * The String is searched backwards starting at fromIndex.
     * This method returns -1 if the index is not found.
     * @param ch	the character to search for
     * @param fromIndex	the index to start the search from
     */
    public int lastIndexOf(int ch, int fromIndex) {
	int min = offset;
	char v[] = value;
	
	for (int i = offset + ((fromIndex >= count) ? count - 1 : fromIndex) ; i >= min ; i--) {
	    if (v[i] == ch) {
		return i - offset;
	    }
	}
	return -1;
    }

    /**
     * Returns the index within this String of the first occurrence of the specified substring.
     * This method returns -1 if the index is not found.
     * @param str 	the substring to search for
     */
    public int indexOf(String str) {
	return indexOf(str, 0);
    }

    /**
     * Returns the index within this String of the first occurrence of the specified substring.
     * The search is started at fromIndex.
     * This method returns -1 if the index is not found.
     * @param str 	the substring to search for
     * @param fromIndex	the index to start the search from
     */
    public int indexOf(String str, int fromIndex) {
	char v1[] = value;
	char v2[] = str.value;
	int max = offset + (count - str.count);
      test:
	for (int i = offset + ((fromIndex < 0) ? 0 : fromIndex); i <= max ; i++) {
	    int n = str.count;
	    int j = i;
	    int k = str.offset;
	    while (n-- != 0) {
		if (v1[j++] != v2[k++]) {
		    continue test;
		}
	    }
	    return i - offset;
	}
	return -1;
    }

    /**
     * Returns the index within this String of the last occurrence of the specified substring.
     * The String is searched backwards.
     * This method returns -1 if the index is not found.
     * @param str 	the substring to search for
     */
    public int lastIndexOf(String str) {
	return lastIndexOf(str, count - 1);
    }

    /**
     * Returns the index within this String of the last occurrence of the specified substring.
     * The String is searched backwards starting at fromIndex.
     * This method returns -1 if the index is not found.
     * @param str 	the substring to search for
     * @param fromIndex	the index to start the search from
     */
    public int lastIndexOf(String str, int fromIndex) {
	char v1[] = value;
	char v2[] = str.value;
	int min = offset;
      test:
	for (int i = offset + ((fromIndex >= count) ? count - 1 : fromIndex); i >= min ; i--) {
	    int n = str.count;
	    int j = i;
	    int k = str.offset;
	    while (n-- != 0) {
		if (v1[j++] != v2[k++]) {
		    continue test;
		}
	    }
	    return i - offset;
	}
	return -1;
    }

    /**
     * Returns the substring of this String. The substring is specified
     * by a beginIndex (inclusive) and the end of the string.
     * @param beginIndex the beginning index, inclusive
     */
    public String substring(int beginIndex) {
	return substring(beginIndex, length());
    }

    /**
     * Returns the substring of a String. The substring is specified
     * by a beginIndex (inclusive) and an endIndex (exclusive).
     * @param beginIndex the beginning index, inclusive
     * @param endIndex the ending index, exclusive
     * @exception StringIndexOutOfBoundsException If the beginIndex or the endIndex is out 
     * of range.
     */
    public String substring(int beginIndex, int endIndex) {
	if (beginIndex > endIndex) {
	    int tmp = beginIndex;
	    beginIndex = endIndex;
	    endIndex = tmp;
	}
	if (beginIndex < 0) {
	    throw new StringIndexOutOfBoundsException(beginIndex);
	} 
	if (endIndex > count) {
	    throw new StringIndexOutOfBoundsException(endIndex);
	}
	return ((beginIndex == 0) && (endIndex == count)) ? this :
		   new String(value, offset + beginIndex, endIndex - beginIndex);
    }

    /**
     * Concatenates the specified string to the end of this String.
     * @param str	the String which is concatenated to the end of this String
     */
    public String concat(String str) {
	int otherLen = str.length();
	if (otherLen == 0) {
	    return this;
	}
	char buf[] = new char[count + otherLen];
	getChars(0, count, buf, 0);
	str.getChars(0, otherLen, buf, count);
	return new String(buf);
    }

    /**
     * Converts this String by replacing all occurences of oldChar with newChar.
     * @param oldChar	the old character
     * @param newChar	the new character
     */
    public String replace(char oldChar, char newChar) {
	if (oldChar != newChar) {
	    int len = count;
	    int i = -1;
	    while (++i < len) {
		if (value[offset + i] == oldChar) {
		    break;
		}
	    }
	    if (i < len) {
		char buf[] = new char[len];
		for (int j = 0 ; j < i ; j++) {
		    buf[j] = value[offset+j];
		}
		while (i < len) {
		    char c = value[offset + i];
		    buf[i] = (c == oldChar) ? newChar : c;
		    i++;
		}
		return new String(buf);
	    }
	}
	return this;
    }

    /**
     * Converts all of the characters in this String to lower case.
     * @return the String, converted to lowercase.
     * @see Character#toLowerCase
     * @see String#toUpperCase
     */
    public String toLowerCase() {
	int len = count;
	char trt[] = Character.downCase;
	int i, c;
	for (i = 0 ; i < len ; i++) {
	    c = value[offset+i];
	    if ((c < 256) && (trt[c] != c)) {
		break;
	    }
	}
	if (i >= len) {
	    return this;
	}
	char buf[] = new char[len];
	for (i = 0 ; i < len ; i++) {
	    c = value[offset+i];
	    buf[i] = (c < 256) ? trt[c] : (char)c;
	}
	return new String(buf);
    }

    /**
     * Converts all of the characters in this String to upper case.
     * @return the String, converted to uppercase.
     * @see Character#toUpperCase
     * @see String#toLowerCase
     */
    public String toUpperCase() {
	int len = count;
	char trt[] = Character.upCase;
	int i, c;
	for (i = 0 ; i < len ; i++) {
	    c = value[offset+i];
	    if ((c < 256) && (trt[c] != c)) {
		break;
	    }
	}
	if (i >= len) {
	    return this;
	}
	char buf[] = new char[len];
	for (i = 0 ; i < len ; i++) {
	    c = value[offset+i];
	    buf[i] = (c < 256) ? trt[c] : (char)c;
	}
	return new String(buf);
    }

    /**
     * Trims leading and trailing whitespace from this String.
     * @return the String, with whitespace removed.
     */
    public String trim() {
	int len = count;
	int st = 0;
	while ((st < len) && (value[offset + st] <= ' ')) {
	    st++;
	}
	while ((st < len) && (value[offset + len - 1] <= ' ')) {
	    len--;
	}
	return ((st > 0) || (len < count)) ? substring(st, len) : this;
    }

    /**
     * Converts this String to a String.
     * @return the String itself.
     */
    public String toString() {
	return this;
    }

    /**
     * Converts this String to a character array. This creates a new array.
     * @return 	an array of characters.
     */
    public char[] toCharArray() {
	int i, max = length();
	char result[] = new char[max];
	getChars(0, max, result, 0);
	return result;
    }

    /**
     * Returns a String that represents the String value of the object.
     * The object may choose how to represent itself by implementing
     * the toString() method.
     * @param obj	the object to be converted
     */
    public static String valueOf(Object obj) {
	return (obj == null) ? "null" : obj.toString();
    }

    /**
     * Returns a String that is equivalent to the specified character array.
     * Uses the original array as the body of the String (ie. it does not
     * copy it to a new array).
     * @param data	the character array
     */
    public static String valueOf(char data[]) {
	return new String(data);
    }

    /**
     * Returns a String that is equivalent to the specified character array.
     * @param data	the character array
     * @param offset	the offset into the value of the String
     * @param count 	the length of the value of the String
     */
    public static String valueOf(char data[], int offset, int count) {
	return new String(data, offset, count);
    }

    
    /**
     * Returns a String that is equivalent to the specified character array.
     * It creates a new array and copies the characters into it.
     * @param data	the character array
     * @param offset	the offset into the value of the String
     * @param count 	the length of the value of the String
     */
    public static String copyValueOf(char data[], int offset, int count) {
	char str[] = new char[count];
	System.arraycopy(data, offset, str, 0, count);
	return new String(str);
    }

    /**
     * Returns a String that is equivalent to the specified character array.
     * It creates a new array and copies the characters into it.
     * @param data	the character array
     */
    public static String copyValueOf(char data[]) {
	return copyValueOf(data, 0, data.length);
    }

    /**
     * Returns a String object that represents the state of the specified boolean.
     * @param b	the boolean
     */
    public static String valueOf(boolean b) {
	return b ? "true" : "false";
    }

    /**
     * Returns a String object that contains a single character
     * @param c the character
     * @return 	the resulting String.
     */
    public static String valueOf(char c) {
	char data[] = {c};
	return new String(data);
    }

    /**
     * Returns a String object that represents the value of the specified integer.
     * @param i	the integer
     */
    public static String valueOf(int i) {
        return Integer.toString(i, 10);
    }

    /**
     * Returns a String object that represents the value of the specified long.
     * @param l	the long
     */
    public static String valueOf(long l) {
        return Long.toString(l, 10);
    }

    /**
     * Returns a String object that represents the value of the specified float.
     * @param f	the float
     */
    public static String valueOf(float f) {
	return Float.toString(f);
    }

    /**
     * Returns a String object that represents the value of the specified double.
     * @param d	the double
     */
    public static String valueOf(double d) {
	return Double.toString(d);
    }


    /**
     * The set of internalized Strings.
     */
    private static Hashtable InternSet;

    /**
     * Returns a String that is equal to this String
     * but which is guaranteed to be from the unique String pool.  For example:
     * <pre>s1.intern() == s2.intern() <=> s1.equals(s2).</pre>
     */
    public String intern() {
	if (InternSet == null) {
	    InternSet = new Hashtable();
	}
	String s = (String) InternSet.get(this);
	if (s != null) {
	    return s;
	}
	InternSet.put(this, this);
	return this;
    }

    /**
     * Compute the length of this string's UTF encoded form.
     */
    int utfLength() {
	int limit = offset + count;
	int utflen = 0;
	for (int i = offset; i < limit; i++) {
	    int c = value[i];
	    if ((c >= 0x0001) && (c <= 0x007F)) {
		utflen++;
	    } else if (c > 0x07FF) {
		utflen += 3;
	    } else {
		utflen += 2;
	    }
	}
	return utflen;
    }
}

 
public final class StringBuffer {
    /** The value is used for character storage. */
    private char value[];

    /** The count is the number of characters in the buffer. */
    private int count;

    /** A flag indicating whether the buffer is shared */
    private boolean shared;

    /**
     * Constructs an empty String buffer.
     */
    public StringBuffer() {
	this(16);
    }

    /**
     * Constructs an empty String buffer with the specified initial length.
     * @param length	the initial length
     */
    public StringBuffer(int length) {
	value = new char[length];
	shared = false;
    }

    /**
     * Constructs a String buffer with the specified initial value.
     * @param str	the initial value of the buffer
     */
    public StringBuffer(String str) {
	this(str.length() + 16);
	append(str);
    }

    /**
     * Returns the length (character count) of the buffer.
     */
    public int length() {
	return count;
    }

    /**
     * Returns the current capacity of the String buffer. The capacity
     * is the amount of storage available for newly inserted
     * characters; beyond which an allocation will occur.
     */
    public int capacity() {
	return value.length;
    }

    /**
     * Copies the buffer value if it is shared.
     */
    private void copyWhenShared() {
	if (shared) {
	    char newValue[] = new char[value.length];
	    System.arraycopy(value, 0, newValue, 0, count);
	    value = newValue;
	    shared = false;
	}
    }

    /**
     * Ensures that the capacity of the buffer is at least equal to the
     * specified minimum.
     * @param minimumCapacity	the minimum desired capacity
     */
    public synchronized void ensureCapacity(int minimumCapacity) {
	int maxCapacity = value.length;

	if (minimumCapacity > maxCapacity) {
	    int newCapacity = (maxCapacity + 1) * 2;
	    if (minimumCapacity > newCapacity) {
		newCapacity = minimumCapacity;
	    }

	    char newValue[] = new char[newCapacity];
	    System.arraycopy(value, 0, newValue, 0, count);
	    value = newValue;
	    shared = false;
	}
    }

    /**
     * Sets the length of the String. If the length is reduced, characters
     * are lost. If the length is extended, the values of the new characters
     * are set to 0.
     * @param newLength	the new length of the buffer
     * @exception StringIndexOutOfBoundsException  If the length is invalid.
     */
    public synchronized void setLength(int newLength) {
	if (newLength < 0) {
	    throw new StringIndexOutOfBoundsException(newLength);
	}
	ensureCapacity(newLength);

	if (count < newLength) {
	    copyWhenShared();
	    for (; count < newLength; count++) {
		value[count] = '\0';
	    }
	}
	count = newLength;
    }

    /**
     * Returns the character at the specified index. An index ranges
     * from 0..length()-1.
     * @param index	the index of the desired character
     * @exception StringIndexOutOfBoundsException If the index is invalid.
     */
    public synchronized char charAt(int index) {
	if ((index < 0) || (index >= count)) {
	    throw new StringIndexOutOfBoundsException(index);
	}
	return value[index];
    }

    /**
     * Copies the characters of the specified substring (determined by
     * srcBegin and srcEnd) into the character array, starting at the
     * array's dstBegin location. Both srcBegin and srcEnd must be legal
     * indexes into the buffer.
     * @param srcBegin	begin copy at this offset in the String
     * @param srcEnd	stop copying at this offset in the String
     * @param dst		the array to copy the data into
     * @param dstBegin	offset into dst
     * @exception StringIndexOutOfBoundsException If there is an invalid index into the buffer.
     */
    public synchronized void getChars(int srcBegin, int srcEnd, char dst[], int dstBegin) {
	if ((srcBegin < 0) || (srcBegin >= count)) {
	    throw new StringIndexOutOfBoundsException(srcBegin);
	}
	if ((srcEnd < 0) || (srcEnd > count)) {
	    throw new StringIndexOutOfBoundsException(srcEnd);
	}
	if (srcBegin < srcEnd) {
	    System.arraycopy(value, srcBegin, dst, dstBegin, srcEnd - srcBegin);
	}
    }

    /**
     * Changes the character at the specified index to be ch.
     * @param index	the index of the character
     * @param ch		the new character
     * @exception	StringIndexOutOfBoundsException If the index is invalid.
     */
    public synchronized void setCharAt(int index, char ch) {
	if ((index < 0) || (index >= count)) {
	    throw new StringIndexOutOfBoundsException(index);
	}
	copyWhenShared();
	value[index] = ch;
    }

    /**
     * Appends an object to the end of this buffer.
     * @param obj	the object to be appended
     * @return 	the StringBuffer itself, NOT a new one.
     */
    public synchronized StringBuffer append(Object obj) {
	return append(String.valueOf(obj));
    }

    /**
     * Appends a String to the end of this buffer.
     * @param str	the String to be appended
     * @return 	the StringBuffer itself, NOT a new one.
     */
    public synchronized StringBuffer append(String str) {
	if (str == null) {
	    str = String.valueOf(str);
	}

	int len = str.length();
	ensureCapacity(count + len);
	copyWhenShared();
	str.getChars(0, len, value, count);
	count += len;
	return this;
    }

    /**
     * Appends an array of characters to the end of this buffer.
     * @param str	the characters to be appended
     * @return 	the StringBuffer itself, NOT a new one.
     */
    public synchronized StringBuffer append(char str[]) {
	int len = str.length;
	ensureCapacity(count + len);
	copyWhenShared();
	System.arraycopy(str, 0, value, count, len);
	count += len;
	return this;
    }

    /**
     * Appends a part of an array of characters to the end of this buffer.
     * @param str	the characters to be appended
     * @param offset	where to start
     * @param len	the number of characters to add
     * @return 	the StringBuffer itself, NOT a new one.
     */
    public synchronized StringBuffer append(char str[], int offset, int len) {
	ensureCapacity(count + len);
	copyWhenShared();
	System.arraycopy(str, offset, value, count, len);
	count += len;
	return this;
    }

    /**
     * Appends a boolean to the end of this buffer.
     * @param b	the boolean to be appended
     * @return 	the StringBuffer itself, NOT a new one.
     */
    public StringBuffer append(boolean b) {
	return append(String.valueOf(b));
    }

    /**
     * Appends a character to the end of this buffer.
     * @param ch	the character to be appended
     * @return 	the StringBuffer itself, NOT a new one.
     */
    public synchronized StringBuffer append(char c) {
	ensureCapacity(count + 1);
	copyWhenShared();
	value[count++] = c;
	return this;
    }

    /**
     * Appends an integer to the end of this buffer.
     * @param i	the integer to be appended
     * @return 	the StringBuffer itself, NOT a new one.
     */
    public StringBuffer append(int i) {
	return append(String.valueOf(i));
    }

    /**
     * Appends a long to the end of this buffer.
     * @param l	the long to be appended
     * @return 	the StringBuffer itself, NOT a new one.
     */
    public StringBuffer append(long l) {
	return append(String.valueOf(l));
    }

    /**
     * Appends a float to the end of this buffer.
     * @param f	the float to be appended
     * @return 	the StringBuffer itself, NOT a new one.
     */
    public StringBuffer append(float f) {
	return append(String.valueOf(f));
    }

    /**
     * Appends a double to the end of this buffer.
     * @param d	the double to be appended
     * @return 	the StringBuffer itself, NOT a new one.
     */
    public StringBuffer append(double d) {
	return append(String.valueOf(d));
    }

    /**
     * Inserts an object into the String buffer.
     * @param offset	the offset at which to insert
     * @param obj		the object to insert
     * @return 		the StringBuffer itself, NOT a new one.
     * @exception	StringIndexOutOfBoundsException If the offset is invalid.
     */
    public synchronized StringBuffer insert(int offset, Object obj) {
	return insert(offset, String.valueOf(obj));
    }

    /**
     * Inserts a String into the String buffer.
     * @param offset	the offset at which to insert
     * @param str		the String to insert
     * @return 		the StringBuffer itself, NOT a new one.
     * @exception	StringIndexOutOfBoundsException If the offset is invalid.
     */
    public synchronized StringBuffer insert(int offset, String str) {
	if ((offset < 0) || (offset > count)) {
	    throw new StringIndexOutOfBoundsException();
	}
	int len = str.length();
	ensureCapacity(count + len);
	copyWhenShared();
	System.arraycopy(value, offset, value, offset + len, count - offset);
	str.getChars(0, len, value, offset);
	count += len;
	return this;
    }

    /**
     * Inserts an array of characters into the String buffer.
     * @param offset	the offset at which to insert
     * @param str		the characters to insert
     * @return 		the StringBuffer itself, NOT a new one.
     * @exception	StringIndexOutOfBoundsException If the offset is invalid.
     */
    public synchronized StringBuffer insert(int offset, char str[]) {
	if ((offset < 0) || (offset > count)) {
	    throw new StringIndexOutOfBoundsException();
	}
	int len = str.length;
	ensureCapacity(count + len);
	copyWhenShared();
	System.arraycopy(value, offset, value, offset + len, count - offset);
	System.arraycopy(str, 0, value, offset, len);
	count += len;
	return this;
    }

    /**
     * Inserts a boolean into the String buffer.
     * @param offset	the offset at which to insert
     * @param b		the boolean to insert
     * @return 		the StringBuffer itself, NOT a new one.
     * @exception	StringIndexOutOfBoundsException If the offset is invalid.
     */
    public StringBuffer insert(int offset, boolean b) {
	return insert(offset, String.valueOf(b));
    }

    /**
     * Inserts a character into the String buffer.
     * @param offset	the offset at which to insert
     * @param ch		the character to insert
     * @return 		the StringBuffer itself, NOT a new one.
     * @exception	StringIndexOutOfBoundsException If the offset invalid.
     */
    public synchronized StringBuffer insert(int offset, char c) {
	ensureCapacity(count + 1);
	copyWhenShared();
	System.arraycopy(value, offset, value, offset + 1, count - offset);
	value[offset] = c;
	count += 1;
	return this;
    }

    /**
     * Inserts an integer into the String buffer.
     * @param offset	the offset at which to insert
     * @param i		the integer to insert
     * @return 		the StringBuffer itself, NOT a new one.
     * @exception	StringIndexOutOfBoundsException If the offset is invalid.
     */
    public StringBuffer insert(int offset, int i) {
	return insert(offset, String.valueOf(i));
    }

    /**
     * Inserts a long into the String buffer.
     * @param offset	the offset at which to insert
     * @param l		the long to insert
     * @return 		the StringBuffer itself, NOT a new one.
     * @exception	StringIndexOutOfBoundsException If the offset is invalid.
     */
    public StringBuffer insert(int offset, long l) {
	return insert(offset, String.valueOf(l));
    }

    /**
     * Inserts a float into the String buffer.
     * @param offset	the offset at which to insert
     * @param f		the float to insert
     * @return 		the StringBuffer itself, NOT a new one.
     * @exception	StringIndexOutOfBoundsException If the offset is invalid.
     */
    public StringBuffer insert(int offset, float f) {
	return insert(offset, String.valueOf(f));
    }

    /**
     * Inserts a double into the String buffer.
     * @param offset	the offset at which to insert
     * @param d		the double to insert
     * @return 		the StringBuffer itself, NOT a new one.
     * @exception	StringIndexOutOfBoundsException If the offset is invalid.
     */
    public StringBuffer insert(int offset, double d) {
	return insert(offset, String.valueOf(d));
    }

    /**
     * Converts to a String representing the data in the buffer.
     */
    public String toString() {
	return new String(this);
    }


    //
    // The following two methods are needed by String to efficiently
    // convert a StringBuffer into a String.  They are not public.
    // They shouldn't be called by anyone but String.
    void setShared() { shared = true; } 
    char[] getValue() { return value; }
}

public
class StringIndexOutOfBoundsException extends IndexOutOfBoundsException {
    /**
     * Constructs a StringIndexOutOfBoundsException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public StringIndexOutOfBoundsException() {
	super();
    }

    /**
     * Constructs a StringIndexOutOfBoundsException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the String containing a detail message about the error
     */
    public StringIndexOutOfBoundsException(String s) {
	super(s);
    }

    /**
     * Constructs a StringIndexOutOfBoundsException initialized with
     * the specified index.
     * @param index the offending index
     */
    public StringIndexOutOfBoundsException(int index) {
	super("String index out of range: " + index);
    }
}



public final
class System {

    /** Don't let anyone instantiate this class */
    private System() {
    }

    /**
     * Standard input stream.  This stream is used for reading in character
     * data.
     */
    public static InputStream in;

    /**
     * Standard output stream. This stream is used for printing messages.
     */
    public static PrintStream out;

    /**
     * Standard error stream. This stream can be used to print error messages.
     * Many applications read in data from an InputStream and output messages via
     * the PrintStream out statement.  Often applications rely on command line
     * redirection to specify source and destination files.  A problem with redirecting
     * standard output is the incapability of writing messages to the screen if the
     * output has been redirected to a file.  This problem can be overcome by sending
     * some output to PrintStream out and other output to PrintStream err.  The
     * difference between PrintStream err and PrintStream out is that PrintStream
     * err is often used for displaying error messages but may be used for any purpose.
     */
    public static PrintStream err;

    static {
	try {
	    in = new BufferedInputStream(new FileInputStream(FileDescriptor.in), 128);
	    out = new PrintStream(new BufferedOutputStream(new FileOutputStream(FileDescriptor.out), 128), true);
	    err = new PrintStream(new BufferedOutputStream(new FileOutputStream(FileDescriptor.err), 128), true);
	} catch (Exception e) {
	    throw new Error("can't initialize stdio");
	}
    }

    /* The security manager for the system.
     */
    private static SecurityManager security;

    /**
     * Sets the System security. This value can only be set once.
     * @param s the security manager
     * @exception SecurityException If the SecurityManager has already been set.
     */
    public static void setSecurityManager(SecurityManager s) {
	if (security != null) {
	    throw new SecurityException("SecurityManager already set");
	}
	security = s;
    }

    /**
     * Gets the system security interface.
     */
    public static SecurityManager getSecurityManager() {
	return security;
    }

    /**
     * Returns the current time in milliseconds GMT since the epoch (00:00:00
     * UTC, January 1, 1970).  It is a signed 64 bit integer, and so it will
     * not overflow until the year 292280995.
     * @see java.util.Date
     */
    public static native long currentTimeMillis();


    /** 
     * Copies an array from the source array, beginning at the
     * specified position, to the specified position of the destination array.
     * This method does not allocate memory for the destination array.  The
     * memory must already be allocated.
     * @param src	the source data
     * @param srcpos	start position in the source data
     * @param dest	the destination
     * @param destpos	start position in the destination data
     * @param length	the number of array elements to be copied
     * @exception ArrayIndexOutOfBoundsException If copy would cause
     *			access of data outside array bounds.
     * @exception ArrayStoreException If an element in the src array could
     *  		could not be stored into the destination array due
     *			to a type mismatch
     */
    public static native void arraycopy(Object src, int src_position,
                                        Object dst, int dst_position,
                                        int length);

    /**
     * System properties. The following properties are guaranteed to be defined:
     * <dl>
     * <dt>java.version		<dd>Java version number
     * <dt>java.vendor		<dd>Java vendor specific string
     * <dt>java.vendor.url	<dd>Java vendor URL
     * <dt>java.home		<dd>Java installation directory
     * <dt>java.class.version	<dd>Java class version number
     * <dt>java.class.path	<dd>Java classpath
     * <dt>os.name		<dd>Operating System Name
     * <dt>os.arch		<dd>Operating System Architecture
     * <dt>os.version		<dd>Operating System Version
     * <dt>file.separator	<dd>File separator ("/" on Unix)
     * <dt>path.separator	<dd>Path separator (":" on Unix)
     * <dt>line.separator	<dd>Line separator ("\n" on Unix)
     * <dt>user.name		<dd>User account name
     * <dt>user.home		<dd>User home directory
     * <dt>user.dir		<dd>User's current working directory
     * </dl>
     */
    private static Properties props;
    private static native Properties initProperties(Properties props);

    /**
     * Gets the System properties.
     */
    public static Properties getProperties() {
	if (props == null) {
	    props = initProperties(new Properties());
	}
	if (security != null) {
	    security.checkPropertiesAccess();
	}
	return props;
    }

    /**
     * Sets the System properties to the specified properties.
     * @param props the properties to be set
     */
    public static void setProperties(Properties props) {
	if (security != null) {
	    security.checkPropertiesAccess();
	}
	System.props = props;
    }
    
    /**
     * Gets the System property indicated by the specified key.
     * @param key the name of the system property
     */
    public static String getProperty(String key) {
	if (security != null) {
	    security.checkPropertyAccess(key);
	}
	if (props == null) {
	    props = initProperties(new Properties());
	}
	return props.getProperty(key);
    }
    
    /**
     * Gets the System property indicated by the specified key and def.
     * @param key the name of the system property
     * @param def the default value to use if this property is not set
     */
    public static String getProperty(String key, String def) {
	if (security != null) {
	    security.checkPropertyAccess(key); 
	}
	if (props == null) {
	    props = initProperties(new Properties());
	}
	return props.getProperty(key, def);
    }
    
    /** Obsolete. 
     * Gets an environment variable. An environment variable is a
     * system dependent external variable that has a string value.
     * @param name the name of the environment variable
     * @return 	the value of the variable, or null if the variable is
     *		not defined.
     * 
     */
    public static String getenv(String name) {
	throw new Error("getenv no longer supported, use properties and -D instead: " + name);
    }


    /**
     * Exits the virtual machine with an exit code. This method does
     * not return, use with caution.
     * @param status exit status, 0 if successful, other values indicate
     *        various error types. 
     * @see Runtime#exit
     */
    public static void exit (int status) {
	Runtime.getRuntime().exit(status);
    }

    /**
     * Runs the garbage collector.
     * @see Runtime#gc
     */
    public static void gc() {
	Runtime.getRuntime().gc();
    }

    /**
     * Runs the finalization methods of any objects pending finalization.
     * @see Runtime#gc
     */
    public static void runFinalization() {
	Runtime.getRuntime().runFinalization();
    }

    /**
     * Loads a dynamic library, given a complete path name. 
     * @param filename the file to load
     * @exception UnsatisfiedLinkError If the file does not exist.
     * @see Runtime#load
     */
    public static void load(String filename) {
	Runtime.getRuntime().load(filename);
    }

    /**
     * Loads a dynamic library with the specified library name. 
     * @param libname the name of the library
     * @exception UnsatisfiedLinkError If the library does not exist. 
     * @see Runtime#loadLibrary
     */
    public static void loadLibrary(String libname) {
	Runtime.getRuntime().loadLibrary(libname);
    }

}

public
class Thread implements Runnable {
    private char	name[];
    private int         priority;
    private Thread	threadQ;
    private int 	PrivateInfo;
    private int		eetop;

    /* Whether or not to single_step this thread. */
    private boolean	single_step;

    /* Whether or not the thread is a daemon thread. */
    private boolean	daemon = false;

    /* Whether or not this thread was asked to exit before it runs.*/
    private boolean	stillborn = false;

    /* What will be run. */
    private Runnable target;

    /* The system queue of threads is linked through activeThreadQueue. */
    private static Thread activeThreadQ;

    /* The group of this thread */
    private ThreadGroup group;

    /* For autonumbering anonymous threads. */
    private static int threadInitNumber;
    private static synchronized int nextThreadNum() {
	return threadInitNumber++;
    }

    /**
     * The minimum priority that a Thread can have.  The most minimal priority is equal to 1.      
     */
    public final static int MIN_PRIORITY = 1;

    /**
     * The default priority that is assigned to a Thread.  The default priority is equal to 5.
     */
    public final static int NORM_PRIORITY = 5;

    /**
     * The maximum priority that a Thread can have.  The maximal priority value a Thread can have is 10.
     */
    public final static int MAX_PRIORITY = 10;

    /**
     * Returns a reference to the currently executing Thread object.
     */
    public static native Thread currentThread();

    /**
     * Causes the currently executing Thread object to yield.
     * If there are other runnable Threads they will be
     * scheduled next.
     */
    public static native void yield();

    /**	
     * Causes the currently executing Thread to sleep for the specified
     * number of milliseconds.
     * @param millis  the length of time to sleep in milliseconds
     * @exception InterruptedException 
     *            Another thread has interrupted this thread.      */
    public static native void sleep(long millis) throws InterruptedException;

    /**
     * Sleep, in milliseconds and additional nanosecond.
     * @param millis  the length of time to sleep in milliseconds
     * @param nanos   0-999999 additional nanoseconds to sleep
     * @exception InterruptedException 
     *            Another thread has interrupted this thread. 
     */
    public static void sleep(long millis, int nanos) throws InterruptedException {
	if (nanos > 500000)
		millis++;
	sleep(millis);
    }

    /**
     * Initialize a Thread.
     * @param g the Thread group
     * @param target the object whose run() method gets called
     * @param name the name of the new Thread
     */
    private void init(ThreadGroup g, Runnable target, String name){
	Thread parent = currentThread();
	if (g == null) {
	    g = parent.getThreadGroup();
	} else {
	    g.checkAccess();
	}
	this.group = g;
	this.daemon = parent.isDaemon();
	this.priority = parent.getPriority();
	this.name = name.toCharArray();
	this.target = target;
	setPriority0(priority);
	g.add(this);
    }

    /**
     * Constructs a new Thread. Threads created this way must have
     * overridden their run() method to actually do anything.  An example
     * illustrating this method being used is shown.
     * <p><pre>
     * import java.lang.*; 
     * <p>
     * class plain01 implements Runnable {
     *   String name; 
     *   plain01() {
     *     name = null;
     *   }
     *   plain01(String s) {
     *     name = s;
     *   }
     *   public void run() {
     *     if (name == null)
     *       System.out.println("A new thread created");
     *     else
     *       System.out.println("A new thread with name " + name + " created");
     *   }
     * }<p>
     * class threadtest01 {
     *   public static void main(String args[] ) {
     *     int failed = 0 ;
     * <p>
     * <b>   Thread t1 = new Thread();</b>  
     *     if(t1 != null) {
     *       System.out.println("new Thread() succeed");
     *     } else {
     *        System.out.println("new Thread() failed"); 
     *        failed++; 
     *     } </pre>
     * } <p>
     */
    public Thread() {
	init(null, null, "Thread-" + nextThreadNum());
    }

    /**
     * Constructs a new Thread which applies the run() method of
     * the specified target.  
     * @param target	the object whose run() method is called
     */
    public Thread(Runnable target) {
	init(null, target, "Thread-" + nextThreadNum());
    }

    /**
     * Constructs a new Thread in the specified Thread group that applies the run() method of
     * the specified target. 
     * @param group the Thread group
     * @param target	the object whose run() method is called
     */
    public Thread(ThreadGroup group, Runnable target) {
	init(group, target, "Thread-" + nextThreadNum());
    }

    /**
     * Constructs a new Thread with the specified name.  
     * @param name	the name of the new Thread
     */
    public Thread(String name) {
	init(null, null, name);
    }

    /**
     * Constructs a new Thread in the specified Thread group with the specified name.
     * @param group the Thread group
     * @param name	the name of the new Thread
     */
    public Thread(ThreadGroup group, String name) {
	init(group, null, name);
    }

    /**
     * Constructs a new Thread with the specified name and applies
     * the run() method of the specified target.  
     * @param target	the object whose run() method is called
     * @param name	the name of the new Thread
     */
    public Thread(Runnable target, String name) {
	init(null, target, name);
    }
    /**
     * Constructs a new Thread in the specified Thread group with the specified name and
     * applies the run() method of the specified target.
     * @param group the Thread group
     * @param target the object whose run() method is called
     * @param name the name of the new Thread
     */
    public Thread(ThreadGroup group, Runnable target, String name) {
	init(group, target, name);
    }

    /**
     * Starts this Thread. This will cause the run() method to
     * be called. This method will return immediately.
     * @exception IllegalThreadStateException If the thread was already started.
     * @see Thread#run
     * @see Thread#stop
     */
    public synchronized native void start();

    /**
     * The actual body of this Thread. This method is called after
     * the Thread is started. You must either override this
     * method by subclassing class Thread, or you must create
     * the Thread with a Runnable target.
     * @see Thread#start
     * @see Thread#stop
     */
    public void run() {
	if (target != null) {
	    target.run();
	}
    }

    /**
     * This method is called by the system to give a Thread
     * a chance to clean up before it actually exits.
     */
    private void exit() {
	if (group != null) {
	    group.remove(this);
	    group = null;
	}
    }

    /** 
     * Stops a Thread by tossing an object.  By default this
     * routine tosses a new instance of ThreadDeath to the target
     * Thread.  ThreadDeath is not actually a subclass of Exception,
     * but is a subclass of Object.  Users should not normally try
     * to catch ThreadDeath unless they must do some extraordinary
     * cleanup operation.  If ThreadDeath is caught it is important
     * to rethrow the object so that the thread will actually die.
     * The top-level error handler will not print out a message if
     * ThreadDeath falls through.
     *
     * @see Thread#start 
     * @see Thread#run
     */
    public final void stop() {
	stop(new ThreadDeath());
    }

    /**
     * Stops a Thread by tossing an object.  Normally, users should
     * just call the stop() method without any argument.  However, in some
     * exceptional circumstances used by the stop() method to kill a Thread,
     * another object is tossed. ThreadDeath, is not actually a subclass
     * of Exception, but is a subclass of Throwable
     * @param o the Throwable object to be thrown
     * @see Thread#start 
     * @see Thread#run 
     */
    public final synchronized void stop(Throwable o) {
	checkAccess();
	stop0(o);
    }

    /**
     * Send an interrupt to a thread.
     */
    public void interrupt() {
	throw new NoSuchMethodError();
    }

    /**
     * Ask if you have been interrupted.
     */
    public static boolean interrupted() {
	throw new NoSuchMethodError();
    }

    /**
     * Ask if another thread has been interrupted.
     */
    public boolean isInterrupted() {
	throw new NoSuchMethodError();
    }

    /**
     * Destroy a thread, without any cleanup, i.e. just toss its state;
     * any monitors it has locked remain locked.  A last resort.
     */
    public void destroy() {
	throw new NoSuchMethodError();
    }

    /**
     * Returns a boolean indicating if the Thread is active.  Having an 
     * active Thread means that the Thread has been started and has not
     * been stopped.
     */
    public final native boolean isAlive();

    /**
     * Suspends this Thread's execution.
     */
    public final void suspend() {
	checkAccess();
	suspend0();
    }

    /**
     * Resumes this Thread execution.  This method is only valid after suspend()
     * has been invoked.
     */
    public final void resume() {
	checkAccess();
	resume0();
    }

    /**
     * Sets the Thread's priority.
     * @exception IllegalArgumentException If the priority is not within the
     *		range MIN_PRIORITY, MAX_PRIORITY.
     * @see Thread#MIN_PRIORITY
     * @see Thread#MAX_PRIORITY
     * @see Thread#getPriority
     */
    public final void setPriority(int newPriority) {
	checkAccess();
	if (newPriority > MAX_PRIORITY || newPriority < MIN_PRIORITY) {
	    throw new IllegalArgumentException();
	}
	if (newPriority > group.getMaxPriority()) {
	    newPriority = group.getMaxPriority();
	}
	setPriority0(priority = newPriority);
    }

    /**
     * Gets and returns the Thread's priority.
     * @see Thread#setPriority
     */
    public final int getPriority() {
	return priority;
    }

    /**
     * Sets the Thread's name.
     * @param name	the new name of the Thread
     * @see Thread#getName
     */
    public final void setName(String name) {
	checkAccess();
	this.name = name.toCharArray();
    }

    /**
     * Gets and returns this Thread's name.
     * @see Thread#setName
     */
    public final String getName() {
	return String.valueOf(name);
    }

    /**
     * Gets and returns this Thread group.
     */
    public final ThreadGroup getThreadGroup() {
	return group;
    }


    /**
     * Returns the current number of active Threads in this Thread group.
     */
    public static int activeCount() {
	return currentThread().getThreadGroup().activeCount();
    }

    /**
     * Copies, into the specified array, references to every active Thread in this 
     * Thread's group.
     * @return the number of Threads put into the array.
     */
    public static int enumerate(Thread tarray[]) {
	return currentThread().getThreadGroup().enumerate(tarray);
    }

    /**
     * Returns the number of stack frames in this Thread. The Thread
     * must be suspended when this method is called.
     * @exception	IllegalThreadStateException If the Thread is not suspended.
     */
    public native int countStackFrames();

    /**
     * Waits for this Thread to die.  A timeout in milliseconds can
     * be specified.  A timeout of 0 milliseconds means to wait
     * forever.
     * @param millis	the time to wait in milliseconds
     * @exception InterruptedException 
     *            Another thread has interrupted this thread. 
     */
    public final synchronized void join(long millis) throws InterruptedException {
	long base = System.currentTimeMillis();
	long now = 0;

	if (millis == 0) {
	    while (isAlive()) {
		wait(0);
	    }
	} else {
	    while (isAlive()) {
		long delay = millis - now;
		if (delay <= 0) {
		    break;
		}
		wait(delay);
		now = System.currentTimeMillis() - base;
	    }
	}
    }

    /**
     * Waits for the Thread to die, with more precise time.
     * @exception InterruptedException 
     *            Another thread has interrupted this thread. 
     */
    public final synchronized void join(long millis, int nanos) throws InterruptedException {
	if (nanos >= 500000 || millis == 0)
		millis++;
	join(millis);
    }


    /**
     * Waits forever for this Thread to die.
     * @exception InterruptedException 
     *            Another thread has interrupted this thread. 
     */
    public final void join() throws InterruptedException {
	join(0);
    }

    /**
     * A debugging procedure to print a stack trace for the
     * current Thread.
     * @see Throwable#printStackTrace
     */
    public static void dumpStack() {
	new Exception("Stack trace").printStackTrace();
    }

    /**
     * Marks this Thread as a daemon Thread or a user Thread.
     * When there are only daemon Threads left running in the
     * system, Java exits.
     * @param on	determines whether the Thread will be a daemon Thread
     * @exception IllegalThreadStateException If the Thread is active.
     * @see Thread#isDaemon
     */
    public final void setDaemon(boolean on) {
	checkAccess();
	if (isAlive()) {
	    throw new IllegalThreadStateException();
	}
	daemon = on;
    }

    /**
     * Returns the daemon flag of the Thread.
     * @see Thread#setDaemon
     */
    public final boolean isDaemon() {
	return daemon;
    }

    /**
     * Checks whether the current Thread is allowed to modify this Thread.
     * @exception SecurityException If the current Thread is not allowed 
     * to access this Thread group.
     */
    public void checkAccess() {
	SecurityManager security = System.getSecurityManager();
	if (security != null) {
	    security.checkAccess(this);
	}
    }

    /**
     * Returns a String representation of the Thread, including the 
     * thread's name, priority and thread group.
     */
    public String toString() {
	return "Thread[" + getName() + "," + getPriority() + "," + 
			getThreadGroup().getName() + "]";
    }

    /* Some private helper methods */
    private native void setPriority0(int newPriority);
    private native void stop0(Object o);
    private native void suspend0();
    private native void resume0();
}




public
class ThreadGroup {
    ThreadGroup parent;
    String name;
    int maxPriority;
    boolean destroyed;
    boolean daemon;

    int nthreads;
    Thread threads[];

    int ngroups;
    ThreadGroup groups[];

    /**
     * Creates an empty Thread group that is not in any Thread group. 
     * This method is used to create the system Thread group.
     */
    private ThreadGroup() {	// called from C code
	this.name = "system";
	this.maxPriority = Thread.MAX_PRIORITY;
    }

    /**
     * Creates a new ThreadGroup. Its parent will be the Thread group
     * of the current Thread.
     * @param name the name of the new Thread group created
     */
    public ThreadGroup(String name) {
	this(Thread.currentThread().getThreadGroup(), name);
    }

    /**
     * Creates a new ThreadGroup with a specified name in the specified Thread group.
     * @param parent the specified parent Thread group
     * @param name the name of the new Thread group being created
     * @exception NullPointerException If the given thread group is equal to null.
     */
    public ThreadGroup(ThreadGroup parent, String name) {
	if (parent == null) {
	    throw new NullPointerException();
	}
	parent.checkAccess();
	this.name = name;
	this.maxPriority = parent.maxPriority;
	this.daemon = parent.daemon;
	this.parent = parent;
	parent.add(this);
    }

    /**
     * Gets the name of this Thread group.
     */
    public final String getName() {
	return name;
    }

    /**
     * Gets the parent of this Thread group.
     */
    public final ThreadGroup getParent() {
	return parent;
    }

    /**
     * Gets the maximum priority of the group. Threads that are
     * part of this group cannot have a higher priority than the maximum priority.
     */
    public final int getMaxPriority() {
	return maxPriority;
    }

    /**
     * Returns the daemon flag of the Thread group. A daemon Thread group
     * is automatically destroyed when it is found empty after a Thread
     * group or Thread is removed from it.
     */
    public final boolean isDaemon() {
	return daemon;
    }

    /**
     * Changes the daemon status of this group.
     * @param daemon the daemon boolean which is to be set.
     */
    public final void setDaemon(boolean daemon) {
	checkAccess();
	this.daemon = daemon;
    }

    /**
     * Sets the maximum priority of the group. Threads
     * that are already in the group <b>can</b> have a higher priority than the
     * set maximum.
     * @param pri the priority of the Thread group
     */
    public final synchronized void setMaxPriority(int pri) {
	checkAccess();
	if (pri < Thread.MIN_PRIORITY) {
	    maxPriority = Thread.MIN_PRIORITY;
	} else if (pri < maxPriority) {
	    maxPriority = pri;
	}
	for (int i = 0 ; i < ngroups ; i++) {
	    groups[i].setMaxPriority(i);
	}
    }

    /**
     * Checks to see if this Thread group is a parent of or is equal to
     * another Thread group.
     * @param g the Thread group to be checked
     * @return true if this Thread group is equal to or is the parent of another Thread
     * group; false otherwise.
     */
    public final boolean parentOf(ThreadGroup g) {
	for (; g != null ; g = g.parent) {
	    if (g == this) {
		return true;
	    }
	}
	return false;
    }

    /**
     * Checks to see if the current Thread is allowed to modify this group.
     * @exception SecurityException If the current Thread is not allowed 
     * to access this Thread group.
     */
    public final void checkAccess() {
	SecurityManager security = System.getSecurityManager();
	if (security != null) {
	    security.checkAccess(this);
	}
    }

    /**
     * Returns an estimate of the number of active Threads in the
     * Thread group.
     */
    public synchronized int activeCount() {
	int n = nthreads;
	for (int i = 0 ; i < ngroups ; i++) {
	    n += groups[i].activeCount();
	}
	return n;
    }

    /**
     * Copies, into the specified array, references to every active Thread in this Thread group.
     * You can use the activeCount() method to get an estimate of how big
     * the array should be.
     * @param list an array of Threads
     * @return the number of Threads put into the array
     */
    public int enumerate(Thread list[]) {
	return enumerate(list, 0, true);
    }

    /**
     * Copies, into the specified array, references to every active Thread in this Thread group.
     * You can use the activeCount() method to get an estimate of how big
     * the array should be.
     * @param list an array list of Threads
     * @param recurse a boolean indicating whether a Thread has reapearred
     * @return the number of Threads placed into the array.
     */
    public int enumerate(Thread list[], boolean recurse) {
	return enumerate(list, 0, recurse);
    }

    private synchronized int enumerate(Thread list[], int n, boolean recurse) {
	int nt = nthreads;
	if (nt > list.length - n) {
	    nt = list.length - n;
	}
	if (nt > 0) {
	    System.arraycopy(threads, 0, list, n, nt);
	    n += nt;
	}
	if (recurse) {
	    for (int i = 0 ; i < ngroups ; i++) {
		n = groups[i].enumerate(list, n, true);
	    }
	}
	return n;
    }

    /**
     * Returns an estimate of the number of active groups in the
     * Thread group.
     */
    public synchronized int activeGroupCount() {
	int n = ngroups;
	for (int i = 0 ; i < ngroups ; i++) {
	    n += groups[i].activeGroupCount();
	}
	return n;
    }

    /**
     * Copies, into the specified array, references to every active Thread group in this Thread 
     * group.  You can use the activeGroupCount() method to get an estimate of how big
     * the array should be.
     * @param list an array of Thread groups
     * @return the number of Thread groups placed into the array.
     */
    public int enumerate(ThreadGroup list[]) {
	return enumerate(list, 0, true);
    }

    /**
     * Copies, into the specified array, references to every active Thread group in this Thread 
     * group.  You can use the activeGroupCount() method to get an estimate of how big
     * the array should be.
     * @param list an array list of Thread groups
     * @param recurse a boolean indicating if a Thread group has reappeared
     * @return the number of Thread groups placed into the array.
     */
    public int enumerate(ThreadGroup list[], boolean recurse) {
	return enumerate(list, 0, recurse);
    }

    private synchronized int enumerate(ThreadGroup list[], int n, boolean recurse) {
	int ng = ngroups;
	if (ng > list.length - n) {
	    ng = list.length - n;
	}
	if (ng > 0) {
	    System.arraycopy(groups, 0, list, n, ng);
	    n += ng;
	}
	if (recurse) {
	    for (int i = 0 ; i < ngroups ; i++) {
		n = groups[i].enumerate(list, n, true);
	    }
	}
	return n;
    }

    /**
     * Stops all the Threads in this Thread group and all of its sub groups.
     */
    public final synchronized void stop() {
	checkAccess();
	for (int i = 0 ; i < ngroups ; i++) {
	    groups[i].stop();
	}
	for (int i = 0 ; i < nthreads ; i++) {
	    threads[i].stop();
	}
    }

    /**
     * Suspends all the Threads in this Thread group and all of its sub groups.
     */
    public final synchronized void suspend() {
	checkAccess();
	for (int i = 0 ; i < ngroups ; i++) {
	    groups[i].suspend();
	}
	for (int i = 0 ; i < nthreads ; i++) {
	    threads[i].suspend();
	}
    }

    /**
     * Resumes all the Threads in this Thread group and all of its sub groups.
     */
    public final synchronized void resume() {
	checkAccess();
	for (int i = 0 ; i < ngroups ; i++) {
	    groups[i].resume();
	}
	for (int i = 0 ; i < nthreads ; i++) {
	    threads[i].resume();
	}
    }

    /**
     * Destroys a Thread group. This does <b>NOT</b> stop the Threads
     * in the Thread group.
     * @exception IllegalThreadStateException If the Thread group is not empty
     * 		or if the Thread group was already destroyed.
     */
    public final synchronized void destroy() {
	checkAccess();
	if (destroyed || (nthreads > 0)) {
	    throw new IllegalThreadStateException();
	}
	while (ngroups > 0) {
	    groups[0].destroy();
	}
	if (parent != null) {
	    destroyed = true;
	    groups = null;
	    threads = null;
	    parent.remove(this);
	}
    }

    /**
     * Adds the specified Thread group to this group.
     * @param g the specified Thread group to be added
     * @exception IllegalThreadStateException If the Thread group has been destroyed.
     */
    private final synchronized void add(ThreadGroup g){
	if (destroyed) {
	    throw new IllegalThreadStateException();
	}
	if (groups == null) {
	    groups = new ThreadGroup[4];
	} else if (ngroups == groups.length) {
	    ThreadGroup newgroups[] = new ThreadGroup[ngroups * 2];
	    System.arraycopy(groups, 0, newgroups, 0, ngroups);
	    groups = newgroups;
	}
	groups[ngroups] = g;

	// This is done last so it doesn't matter in case the
	// thread is killed
	ngroups++;
    }

    /**
     * Removes the specified Thread group from this group.
     * @param g the Thread group to be removed
     * @return if this Thread has already been destroyed.
     */
    private synchronized void remove(ThreadGroup g) {
	if (destroyed) {
	    return;
	}
	for (int i = 0 ; i < ngroups ; i++) {
	    if (groups[i] == g) {
		System.arraycopy(groups, i + 1, groups, i, --ngroups - i);
		// Zap dangling reference to the dead group so that
		// the garbage collector will collect it.
		groups[ngroups] = null;
		break;
	    }
	}
	if (nthreads == 0) {
	    notifyAll();
	}
	if (daemon && (nthreads == 0) && (ngroups == 0)) {
	    destroy();
	}
    }
    
    /**
     * Adds the specified Thread to this group.
     * @param t the Thread to be added
     * @exception IllegalThreadStateException If the Thread group has been destroyed.
     */
    synchronized void add(Thread t) {
	if (destroyed) {
	    throw new IllegalThreadStateException();
	}
	if (threads == null) {
	    threads = new Thread[4];
	} else if (nthreads == threads.length) {
	    Thread newthreads[] = new Thread[nthreads * 2];
	    System.arraycopy(threads, 0, newthreads, 0, nthreads);
	    threads = newthreads;
	}
	threads[nthreads] = t;

	// This is done last so it doesn't matter in case the
	// thread is killed
	nthreads++;
    }

    /**
     * Removes the specified Thread from this group.
     * @param t the Thread to be removed
     * @return if the Thread has already been destroyed.
     */
    synchronized void remove(Thread t) {
	if (destroyed) {
	    return;
	}
	for (int i = 0 ; i < nthreads ; i++) {
	    if (threads[i] == t) {
		System.arraycopy(threads, i + 1, threads, i, --nthreads - i);
		// Zap dangling reference to the dead thread so that
		// the garbage collector will collect it.
		threads[nthreads] = null;
		break;
	    }
	}
	if (nthreads == 0) {
	    notifyAll();
	}
	if (daemon && (nthreads == 0) && (ngroups == 0)) {
	    destroy();
	}
    }

    /**
     * Lists this Thread group. Useful for debugging only.
     */
     public synchronized void list() {
	list(System.out, 0);
     }
     void list(PrintStream out, int indent) {
	for (int j = 0 ; j < indent ; j++) {
	    out.print(" ");
	}
	out.println(this);
	indent += 4;
	for (int i = 0 ; i < nthreads ; i++) {
	    for (int j = 0 ; j < indent ; j++) {
		out.print(" ");
	    }
	    out.println(threads[i]);
	}
	for (int i = 0 ; i < ngroups ; i++) {
	    groups[i].list(out, indent);
	}
     }

    /**
     * Called when a thread in this group exists because of
     * an uncaught exception.
     */
    public void uncaughtException(Thread t, Throwable e) {
	if (parent != null) {
	    parent.uncaughtException(t, e);
	} else if (!(e instanceof ThreadDeath)) {
	    e.printStackTrace(System.err);
	}
    }

    /**
     * Returns a String representation of the Thread group.
     */
    public String toString() {
	return getClass().getName() + "[name=" + getName() + ",maxpri=" + maxPriority + "]";
    }
}


public
class UnsatisfiedLinkError extends LinkageError {
    /**
     * Constructs an UnsatisfiedLinkError with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public UnsatisfiedLinkError() {
	super();
    }

    /**
     * Constructs an UnsatisfiedLinkError with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public UnsatisfiedLinkError(String s) {
	super(s);
    }
}



public
class UnknownError extends VirtualMachineError {
    /**
     * Constructs an UnknownError with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public UnknownError() {
	super();
    }

    /**
     * Constructs an UnknownError with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public UnknownError(String s) {
	super(s);
    }
}







public class ThreadDeath extends Error {}

public
class VerifyError extends LinkageError {
    /**
     * Constructor.
     */
    public VerifyError() {
	super();
    }

    /**
     * Constructor with a detail message.
     */
    public VerifyError(String s) {
	super(s);
    }
}

abstract public
class VirtualMachineError extends Error {
    /**
     * Constructs a VirtualMachineError with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public VirtualMachineError() {
	super();
    }

    /**
     * Constructs a VirtualMachineError with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public VirtualMachineError(String s) {
	super(s);
    }
}
abstract public class ContentHandler {
    /** 
     * Given an input stream positioned at the beginning of the
     * representation of an object, reads that stream and recreates
     * the object from it. 
     * @exception IOException  An IO error occurred while reading the object.
     */
    abstract public Object getContent(URLConnection urlc) throws IOException;
}

public interface ContentHandlerFactory {
   
    /**
     * Creates a new ContentHandler to read an object from a URLStreamHandler.
     * @param mimetype	The mime type for which a content handler is desired.
     */
    ContentHandler createContentHandler(String mimetype);
}

public final 
class DatagramPacket {
    private byte[] buf;
    private int length;
    private InetAddress address;
    private int port;

    /**
     * This constructor is used to create a DatagramPacket object used 
     * for receiving datagrams.
     * @param ibuf is where packet data is to be received.
     * @param ilength is the number of bytes to be received.
     */
    public DatagramPacket(byte ibuf[], int ilength) {
	if (ilength > ibuf.length) {
	    throw new IllegalArgumentException("illegal length");
	}
	buf = ibuf;
	length = ilength;
	address = null;
	port = -1;
    }
    
    /**
     * This constructor is used construct the DatagramPacket to be sent.
     * @param ibuf contains the packet data.
     * @param ilength contains the packet length
     * @param iaddr and iport contains destination ip addr and port number.
     */
    public DatagramPacket(byte ibuf[], int ilength,
			  InetAddress iaddr, int iport) {
	if (ilength > ibuf.length) {
	    throw new IllegalArgumentException("illegal length");
	}
	buf = ibuf;
	length = ilength;
	address = iaddr;
	port = iport;
    }
    
    public InetAddress getAddress() {
	return address;
    }
    public int getPort() {
	return port;
    }
    public byte[] getData() {
	return buf;
    }
    public int getLength() {
	return length;
    }
}




public
class Date {
    private long value;
    private boolean valueValid;
    private boolean expanded;

    private short tm_millis;	/* miliseconds within the second - [0,999] */
    private byte tm_sec;	/* seconds after the minute - [0, 61] for
				 * leap seconds */
    private byte tm_min;	/* minutes after the hour - [0, 59] */
    private byte tm_hour;	/* hour since midnight - [0, 23] */
    private byte tm_mday;	/* day of the month - [1, 31] */
    private byte tm_mon;	/* months since January - [0, 11] */
    private byte tm_wday;	/* days since Sunday - [0, 6] */
    private short tm_yday;	/* days since January 1 - [0, 365] */
    private int tm_year;	/* years since 1900 */
    private int tm_isdst;	/* flag for alternate daylight savings time */

    /**
     * Creates today's date/time.
     */
    public Date () {
	this(System.currentTimeMillis());
    }

    /**
     * Creates a date.
     * The fields are normalized before the Date object is created.
     * The argument does not have to be in the correct range. For
     * example, the 32nd of January is correctly interpreted as the
     * 1st of February.  You can use this to figure out what day a
     * particular date falls on.
     * @param date the value of the argument to be created
     */
    public Date (long date) {
	value = date;
	valueValid = true;
	expanded = false;
    }

    /**
     * Creates a date.
     * The fields are normalized before the Date object is created.
     * The arguments do not have to be in the correct range. For example,
     * the 32nd of January is correctly interpreted as the 1st of February.
     * You can use this to figure out what day a particular date falls on.
     * @param year	a year after 1900
     * @param month	a month between 0-11
     * @param date	day of the month between 1-31
     */
    public Date (int year, int month, int date) {
	this(year, month, date, 0, 0, 0);
    }

    /**
     * Creates a date.
     * The fields are normalized before the Date object is created.
     * The arguments do not have to be in the correct range. For example,
     * the 32nd of January is correctly interpreted as the 1st of February.
     * You can use this to figure out what day a particular date falls on.
     * @param year	a year after 1900
     * @param month	a month between 0-11
     * @param date	day of the month between 1-31
     * @param hrs	hours between 0-23
     * @param min	minutes between 0-59
     */
    public Date (int year, int month, int date, int hrs, int min) {
	this(year, month, date, hrs, min, 0);
    }

    /**
     * Creates a date. The fields are normalized before the Date object is
     * created. The arguments do not have to be in the correct range. For
     * example, the 32nd of January is correctly interpreted as the 1st of
     * February. You can use this to figure out what day a particular date
     * falls on.
     * @param year	a year after 1900
     * @param month	a month between 0-11
     * @param date	day of the month between 1-31
     * @param hrs	hours between 0-23
     * @param min	minutes between 0-59
     * @param sec	seconds between 0-59
     */
    public Date (int year, int month, int date, int hrs, int min, int sec) {
	expanded = true;
	valueValid = false;
	tm_millis = 0;
	tm_sec = (byte) sec;
	tm_min = (byte) min;
	tm_hour = (byte) hrs;
	tm_mday = (byte) date;
	tm_mon = (byte) month;
	tm_wday = 0;
	tm_yday = 0;
	tm_year = year;
	computeValue();
	expand();
    }

    /**
     * Creates a date from a string according to the syntax
     * accepted by parse().
     */
    public Date (String s) {
	this(parse(s));
    }



    /**
     * Calculates a UTC value from YMDHMS. Interpretes
     * the parameters in UTC, <i>not<i> in the local time zone.
     * @param year	a year after 1900
     * @param month	a month between 0-11
     * @param date	day of the month between 1-31
     * @param hrs	hours between 0-23
     * @param min	minutes between 0-59
     * @param sec	seconds between 0-59
     */
    public static long UTC(int year, int month, int date,
			        int hrs, int min, int sec) {
	long day = (date
		    + monthOffset[month]
		    + ((year & 3) != 0
		       || year % 100 == 0 && (year + 300) % 400 != 0
		       || month < 2
		       ? -1 : 0)/* convert day-of-month to 0 based range,
				 * except following February in a leap year,
				 * in which case we skip the conversion to
				 * account for the extra day in February */
		    + (year - 70) * 365L	// days per year
		    + (year - 69) / 4	// plus leap days
		    - (year - 1) / 100	// no leap on century years
		    + (year + 299) / 400);	// except %400 years
	return (sec + 60 * (min + 60 * hrs)) * 1000 + (60 * 60 * 24 * 1000) * day;
    }

    private static short monthOffset[] = {
	0,			// 31	January
	31,			// 28	February
	59,			// 31	March
	90,			// 30	April
	120,			// 31	May
	151,			// 30	June
	181,			// 31	July
	212,			// 31	August
	243,			// 30	September
	273,			// 31	October
	304,			// 30	November
	334			// 31	December
	// 365
    };

    /**
     * Given a string representing a time, parse it and return the time value.
     * It accepts many syntaxes, but most importantly, in accepts the IETF
     * standard date syntax: "Sat, 12 Aug 1995 13:30:00 GMT".  It understands
     * the continental US time zone abbreviations, but for general use, a
     * timezone offset should be used: "Sat, 12 Aug 1995 13:30:00 GMT+0430"
     * (4 hours, 30 minutes west of the Greenwich meridian).
     * If no time zone is specified, the local time zone is assumed.
     * GMT and UTC are considered equivalent.
     */
    public static long parse(String s) {
	int year = -1;
	int mon = -1;
	int mday = -1;
	int hour = -1;
	int min = -1;
	int sec = -1;
	int millis = -1;
	int c = -1;
	int i = 0;
	int n = -1;
	int wst = -1;
	int tzoffset = -1;
	int prevc = 0;
syntax:
	{
	    if (s == null)
		break syntax;
	    int limit = s.length();
	    while (i < limit) {
		c = s.charAt(i);
		i++;
		if (c <= ' ' || c == ',' || c == '-')
		    continue;
		if (c == '(') {	// skip comments
		    int depth = 1;
		    while (i < limit) {
			c = s.charAt(i);
			i++;
			if (c == '(') depth++;
			else if (c == ')')
			    if (--depth <= 0)
			        break;
		    }
		    continue;
		}
		if ('0' <= c && c <= '9') {
		    n = c - '0';
		    while (i < limit && '0' <= (c = s.charAt(i)) && c <= '9') {
			n = n * 10 + c - '0';
			i++;
		    }
		    if (prevc == '+' || prevc == '-' && year>=0) {
			// timezone offset
			if (n < 24)
			    n = n * 60;	// EG. "GMT-3"
			else
			    n = n % 100 + n / 100 * 60;	// eg "GMT-0430"
			if (prevc == '+')	// plus means east of GMT
			    n = -n;
			if (tzoffset != 0 && tzoffset != -1)
			    break syntax;
			tzoffset = n;
		    } else if (n >= 70)
			if (year >= 0)
			    break syntax;
			else if (c <= ' ' || c == ',' || c == '/' || i >= limit)
			    year = n < 1900 ? n : n - 1900;
			else
			    break syntax;
		    else if (c == ':')
			if (hour < 0)
			    hour = (byte) n;
			else if (min < 0)
			    min = (byte) n;
			else
			    break syntax;
		    else if (c == '/')
			if (mon < 0)
			    mon = (byte) n;
			else if (mday < 0)
			    mday = (byte) n;
			else
			    break syntax;
		    else if (i < limit && c != ',' && c > ' ' && c != '-')
			break syntax;
		    else if (hour >= 0 && min < 0)
			min = (byte) n;
		    else if (min >= 0 && sec < 0)
			sec = (byte) n;
		    else if (mday < 0)
			mday = (byte) n;
		    else
			break syntax;
		    prevc = 0;
		} else if (c == '/' || c == ':' || c == '+' || c == '-')
		    prevc = c;
		else {
		    int st = i - 1;
		    while (i < limit) {
			c = s.charAt(i);
			if (!('A' <= c && c <= 'Z' || 'a' <= c && c <= 'z'))
			    break;
			i++;
		    }
		    if (i <= st + 1)
			break syntax;
		    int k;
		    for (k = wtb.length; --k >= 0;)
			if (wtb[k].regionMatches(true, 0, s, st, i - st)) {
			    int action = ttb[k];
			    if (action != 0)
				if (action == 1)	// pm
				    if (hour > 12 || hour < 0)
					break syntax;
				    else
					hour += 12;
				else if (action <= 13)	// month!
				    if (mon < 0)
					mon = (byte) (action - 2);
				    else
					break syntax;
				else
				    tzoffset = action - 10000;
			    break;
			}
		    if (k < 0)
			break syntax;
		    prevc = 0;
		}
	    }
	    if (year < 0 || mon < 0 || mday < 0)
		break syntax;
	    if (sec < 0)
		sec = 0;
	    if (min < 0)
		min = 0;
	    if (hour < 0)
		hour = 0;
	    if (tzoffset == -1)	// no time zone specified, have to use local
		return new Date (year, mon, mday, hour, min, sec).getTime();
	    return UTC(year, mon, mday, hour, min, sec) + tzoffset * (60 * 1000);
	}
	// syntax error
	throw new IllegalArgumentException();
    }
    private final static String wtb[] = {
	"am", "pm",
	"monday", "tuesday", "wednesday", "thursday", "friday",
	"saturday", "sunday",
	"january", "february", "march", "april", "may", "june",
	"july", "august", "september", "october", "november", "december",
	"gmt", "ut", "utc", "est", "edt", "cst", "cdt",
	"mst", "mdt", "pst", "pdt"
	// this time zone table needs to be expanded
    };
    private final static int ttb[] = {
	0, 1, 0, 0, 0, 0, 0, 0, 0,
	2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
	10000 + 0, 10000 + 0, 10000 + 0,	// GMT/UT/UTC
	10000 + 5 * 60, 10000 + 4 * 60,	// EST/EDT
	10000 + 6 * 60, 10000 + 5 * 60,
	10000 + 7 * 60, 10000 + 6 * 60,
	10000 + 8 * 60, 10000 + 7 * 60
    };

    /**
     * Returns the year after 1900.
     */
    public int getYear() {
	if (!expanded)
	    expand();
	return tm_year;
    }

    /**
     * Sets the year.
     * @param year the year value
     */
    public void setYear(int year) {
	if (!expanded)
	    expand();
	tm_year = year;
	valueValid = false;
    }

    /**
     * Returns the month. This method assigns months with the
     * values 0-11, with January beginning at value 0.
     */
    public int getMonth() {
	if (!expanded)
	    expand();
	return tm_mon;
    }

    /**
     * Sets the month.
     * @param month the month value (0-11)
     */
    public void setMonth(int month) {
	if (!expanded)
	    expand();
	tm_mon = (byte) month;
	valueValid = false;
    }

    /**
     * Returns the day of the month. This method assigns days
     * with the values of 1 to 31.
     */
    public int getDate() {
	if (!expanded)
	    expand();
	return tm_mday;
    }

    /**
     * Sets the date.
     * @param date the day value
     */
    public void setDate(int date) {
	if (!expanded)
	    expand();
	tm_mday = (byte) date;
	valueValid = false;
    }

    /**
     * Returns the day of the week. This method assigns days
     * of the week with the values 0-6, with 0 being Sunday.
     */
    public int getDay() {
	if (!expanded) {
	    expand();
	} else if ((tm_wday < 0) || !valueValid) {
	    computeValue();
	    expand();
	}
	return tm_wday;
    }

    /**
     * Returns the hour. This method assigns the value of the
     * hours of the day to range from 0 to 23, with midnight equal
     * to 0.
     */
    public int getHours() {
	if (!expanded)
	    expand();
	return tm_hour;
    }

    /**
     * Sets the hours.
     * @param hours the hour value
     */
    public void setHours(int hours) {
	if (!expanded)
	    expand();
	tm_hour = (byte) hours;
	valueValid = false;
    }

    /**
     * Returns the minute. This method assigns the minutes of an
     * hour to be any value from 0 to 59.
     */
    public int getMinutes() {
	if (!expanded)
	    expand();
	return tm_min;
    }

    /**
     * Sets the minutes.
     * @param minutes the value of the minutes
     */
    public void setMinutes(int minutes) {
	if (!expanded)
	    expand();
	tm_min = (byte) minutes;
	valueValid = false;
    }

    /**
     * Returns the second. This method assigns the seconds of
     * a minute to values of 0-59.
     */
    public int getSeconds() {
	if (!expanded)
	    expand();
	return tm_sec;
    }

    /**
     * Sets the seconds.
     * @param seconds the second value
     */
    public void setSeconds(int seconds) {
	if (!expanded)
	    expand();
	tm_sec = (byte) seconds;
	valueValid = false;
    }

    /**
     * Returns the time in milliseconds since the epoch.
     */
    public long getTime() {
	if (!valueValid)
	    computeValue();
	return value;
    }

    /**
     * Sets the time.
     * @param time	The new time value in milliseconds since the epoch.
     */
    public void setTime(long time) {
	value = time;
	valueValid = true;
	expanded = false;
    }

    /**
     * Checks whether this date comes before the specified date.
     * @param when the date to compare
     * @return true if the original date comes before the specified
     * one; false otherwise.
     */
    public boolean before(Date when) {
	return getTime() < when.getTime();
    }

    /**
     * Checks whether this date comes after the specified date.
     * @param when the date to compare
     * @return true if the original date comes after the specified
     * one; false otherwise.
     */
    public boolean after(Date when) {
	return getTime() > when.getTime();
    }

    /**
     * Compares this object against the specified object.
     * @param obj the object to compare with
     * @return true if the objects are the same; false otherwise.
     */
    public boolean equals(Object obj) {
	return obj != null && obj instanceof Date &&getTime() == ((Date) obj).getTime();
    }

    /**
     * Computes a hashCode.
     */
    public int hashCode() {
	long ht = getTime();
	return (int) ht ^ (int) (ht >> 32);
    }

    /**
     * Converts a date to a String, using the UNIX ctime conventions.
     */
    public native String toString();

    /**
     * Converts a date to a String, using the locale conventions.
     */
    public native String toLocaleString();

    /**
     * Converts a date to a String, using the Internet GMT conventions.
     */
    public native String toGMTString();

    /**
     * Return the time zone offset in minutes for the current locale that is appropriate
     * for this time.  This value would be a constant except for
     * daylight savings time.
     */
    public int getTimezoneOffset() {
	if (!expanded)
	    expand();
	return (int) ((getTime() - UTC(tm_year, tm_mon, tm_mday,
				   tm_hour, tm_min, tm_sec)) / (60 * 1000));
    }

    /*
     * Gets date values.
     */
    private native void expand();
    private native void computeValue();

}

/**
 * Hashtable collision list.
 */
class HashtableEntry {
    int hash;
    Object key;
    Object value;
    HashtableEntry next;

    protected Object clone() {
	HashtableEntry entry = new HashtableEntry();
	entry.hash = hash;
	entry.key = key;
	entry.value = value;
	entry.next = (next != null) ? (HashtableEntry)next.clone() : null;
	return entry;
    }


}

/**
 * Hashtable class. Maps keys to values. Any object can be used as
 * a key and/or value.<p>
 *
 * To sucessfully store and retrieve objects from a hash table, the
 * object used as the key must implement the hashCode() and equals()
 * methods.<p>
 *
 * This example creates a hashtable of numbers. It uses the names of
 * the numbers as keys:
 * <pre>
 *	Hashtable numbers = new Hashtable();
 *	numbers.put("one", new Integer(1));
 *	numbers.put("two", new Integer(2));
 *	numbers.put("three", new Integer(3));
 * </pre>
 * To retrieve a number use:
 * <pre>
 *	Integer n = (Integer)numbers.get("two");
 *	if (n != null) {
 *	    System.out.println("two = " + n);
 *	}
 * </pre>
 *
 * @see java.lang.Object#hashCode
 * @see java.lang.Object#equals
 * @version 	1.33, 12/15/95
 * @author	Arthur van Hoff
 */
public
class Hashtable extends Dictionary implements Cloneable {
    /**
     * The hash table data.
     */
    private HashtableEntry table[];

    /**
     * The total number of entries in the hash table.
     */
    private int count;

    /**
     * Rehashes the table when count exceeds this threshold.
     */
    private int threshold;

    /**
     * The load factor for the hashtable.
     */
    private float loadFactor;

    /**
     * Constructs a new, empty hashtable with the specified initial 
     * capacity and the specified load factor.
     * @param initialCapacity the initial number of buckets
     * @param loadFactor a number between 0.0 and 1.0, it defines
     *		the threshold for rehashing the hashtable into
     *		a bigger one.
     * @exception IllegalArgumentException If the initial capacity
     * is less than or equal to zero.
     * @exception IllegalArgumentException If the load factor is
     * less than or equal to zero.
     */
    public Hashtable(int initialCapacity, float loadFactor) {
	if ((initialCapacity <= 0) || (loadFactor <= 0.0)) {
	    throw new IllegalArgumentException();
	}
	this.loadFactor = loadFactor;
	table = new HashtableEntry[initialCapacity];
	threshold = (int)(initialCapacity * loadFactor);
    }

    /**
     * Constructs a new, empty hashtable with the specified initial 
     * capacity.
     * @param initialCapacity the initial number of buckets
     */
    public Hashtable(int initialCapacity) {
	this(initialCapacity, 0.75f);
    }

    /**
     * Constructs a new, empty hashtable. A default capacity and load factor
     * is used. Note that the hashtable will automatically grow when it gets
     * full.
     */
    public Hashtable() {
	this(101, 0.75f);
    }

    /**
     * Returns the number of elements contained in the hashtable. 
     */
    public int size() {
	return count;
    }

    /**
     * Returns true if the hashtable contains no elements.
     */
    public boolean isEmpty() {
	return count == 0;
    }

    /**
     * Returns an enumeration of the hashtable's keys.
     * @see Hashtable#elements
     * @see Enumeration
     */
    public synchronized Enumeration keys() {
	return new HashtableEnumerator(table, true);
    }

    /**
     * Returns an enumeration of the elements. Use the Enumeration methods 
     * on the returned object to fetch the elements sequentially.
     * @see Hashtable#keys
     * @see Enumeration
     */
    public synchronized Enumeration elements() {
	return new HashtableEnumerator(table, false);
    }

    /**
     * Returns true if the specified object is an element of the hashtable.
     * This operation is more expensive than the containsKey() method.
     * @param value the value that we are looking for
     * @exception NullPointerException If the value being searched 
     * for is equal to null.
     * @see Hashtable#containsKey
     */
    public synchronized boolean contains(Object value) {
	if (value == null) {
	    throw new NullPointerException();
	}

	HashtableEntry tab[] = table;
	for (int i = tab.length ; i-- > 0 ;) {
	    for (HashtableEntry e = tab[i] ; e != null ; e = e.next) {
		if (e.value.equals(value)) {
		    return true;
		}
	    }
	}
	return false;
    }

    /**
     * Returns true if the collection contains an element for the key.
     * @param key the key that we are looking for
     * @see Hashtable#contains
     */
    public synchronized boolean containsKey(Object key) {
	HashtableEntry tab[] = table;
	int hash = key.hashCode();
	int index = (hash & 0x7FFFFFFF) % tab.length;
	for (HashtableEntry e = tab[index] ; e != null ; e = e.next) {
	    if ((e.hash == hash) && e.key.equals(key)) {
		return true;
	    }
	}
	return false;
    }

    /**
     * Gets the object associated with the specified key in the 
     * hashtable.
     * @param key the specified key
     * @returns the element for the key or null if the key
     * 		is not defined in the hash table.
     * @see Hashtable#put
     */
    public synchronized Object get(Object key) {
	HashtableEntry tab[] = table;
	int hash = key.hashCode();
	int index = (hash & 0x7FFFFFFF) % tab.length;
	for (HashtableEntry e = tab[index] ; e != null ; e = e.next) {
	    if ((e.hash == hash) && e.key.equals(key)) {
		return e.value;
	    }
	}
	return null;
    }

    /**
     * Rehashes the content of the table into a bigger table.
     * This method is called automatically when the hashtable's
     * size exceeds the threshold.
     */
    protected void rehash() {
	int oldCapacity = table.length;
	HashtableEntry oldTable[] = table;

	int newCapacity = oldCapacity * 2 + 1;
	HashtableEntry newTable[] = new HashtableEntry[newCapacity];

	threshold = (int)(newCapacity * loadFactor);
	table = newTable;

	//System.out.println("rehash old=" + oldCapacity + ", new=" + newCapacity + ", thresh=" + threshold + ", count=" + count);

	for (int i = oldCapacity ; i-- > 0 ;) {
	    for (HashtableEntry old = oldTable[i] ; old != null ; ) {
		HashtableEntry e = old;
		old = old.next;

		int index = (e.hash & 0x7FFFFFFF) % newCapacity;
		e.next = newTable[index];
		newTable[index] = e;
	    }
	}
    }

    /**
     * Puts the specified element into the hashtable, using the specified
     * key.  The element may be retrieved by doing a get() with the same key.
     * The key and the element cannot be null. 
     * @param key the specified key in the hashtable
     * @param value the specified element
     * @exception NullPointerException If the value of the element 
     * is equal to null.
     * @see Hashtable#get
     * @return the old value of the key, or null if it did not have one.
     */
    public synchronized Object put(Object key, Object value) {
	// Make sure the value is not null
	if (value == null) {
	    throw new NullPointerException();
	}

	// Makes sure the key is not already in the hashtable.
	HashtableEntry tab[] = table;
	int hash = key.hashCode();
	int index = (hash & 0x7FFFFFFF) % tab.length;
	for (HashtableEntry e = tab[index] ; e != null ; e = e.next) {
	    if ((e.hash == hash) && e.key.equals(key)) {
		Object old = e.value;
		e.value = value;
		return old;
	    }
	}

	if (count >= threshold) {
	    // Rehash the table if the threshold is exceeded
	    rehash();
	    return put(key, value);
	} 

	// Creates the new entry.
	HashtableEntry e = new HashtableEntry();
	e.hash = hash;
	e.key = key;
	e.value = value;
	e.next = tab[index];
	tab[index] = e;
	count++;
	return null;
    }

    /**
     * Removes the element corresponding to the key. Does nothing if the
     * key is not present.
     * @param key the key that needs to be removed
     * @return the value of key, or null if the key was not found.
     */
    public synchronized Object remove(Object key) {
	HashtableEntry tab[] = table;
	int hash = key.hashCode();
	int index = (hash & 0x7FFFFFFF) % tab.length;
	for (HashtableEntry e = tab[index], prev = null ; e != null ; prev = e, e = e.next) {
	    if ((e.hash == hash) && e.key.equals(key)) {
		if (prev != null) {
		    prev.next = e.next;
		} else {
		    tab[index] = e.next;
		}
		count--;
		return e.value;
	    }
	}
	return null;
    }

    /**
     * Clears the hash table so that it has no more elements in it.
     */
    public synchronized void clear() {
	HashtableEntry tab[] = table;
	for (int index = tab.length; --index >= 0; )
	    tab[index] = null;
	count = 0;
    }

    /**
     * Creates a clone of the hashtable. A shallow copy is made,
     * the keys and elements themselves are NOT cloned. This is a
     * relatively expensive operation.
     */
    public synchronized Object clone() {
	try { 
	    Hashtable t = (Hashtable)super.clone();
	    t.table = new HashtableEntry[table.length];
	    for (int i = table.length ; i-- > 0 ; ) {
		t.table[i] = (table[i] != null) 
		    ? (HashtableEntry)table[i].clone() : null;
	    }
	    return t;
	} catch (CloneNotSupportedException e) { 
	    // this shouldn't happen, since we are Cloneable
	    throw new InternalError();
	}
    }

    /**
     * Converts to a rather lengthy String.
     */
    public synchronized String toString() {
	int max = size() - 1;
	StringBuffer buf = new StringBuffer();
	Enumeration k = keys();
	Enumeration e = elements();
	buf.append("{");

	for (int i = 0; i <= max; i++) {
	    String s1 = k.nextElement().toString();
	    String s2 = e.nextElement().toString();
	    buf.append(s1 + "=" + s2);
	    if (i < max) {
		buf.append(", ");
	    }
	}
	buf.append("}");
	return buf.toString();
    }
}

/**
 * A hashtable enumerator class.  This class should remain opaque 
 * to the client. It will use the Enumeration interface. 
 */
class HashtableEnumerator implements Enumeration {
    boolean keys;
    int index;
    HashtableEntry table[];
    HashtableEntry entry;

    HashtableEnumerator(HashtableEntry table[], boolean keys) {
	this.table = table;
	this.keys = keys;
	this.index = table.length;
    }
	
    public boolean hasMoreElements() {
	if (entry != null) {
	    return true;
	}
	while (index-- > 0) {
	    if ((entry = table[index]) != null) {
		return true;
	    }
	}
	return false;
    }

    public Object nextElement() {
	if (entry == null) {
	    while ((index-- > 0) && ((entry = table[index]) == null));
	}
	if (entry != null) {
	    HashtableEntry e = entry;
	    entry = e.next;
	    return keys ? e.key : e.value;
	}
	throw new NoSuchElementException("HashtableEnumerator");
    }
		    
}
public
class NoSuchElementException extends RuntimeException {
    /**
     * Constructs a NoSuchElementException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public NoSuchElementException() {
	super();
    }

    /**
     * Constructs a NoSuchElementException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public NoSuchElementException(String s) {
	super(s);
    }
}


class ObserverList extends Vector {
    /** 
     * Notifies all the observers in the list.  This goes from
     * back to front, so that it is OK to remove Observers from
     * the list as a result of this call. 
     * @param who the list of observers
     * @param arg what is being notified
     */
    public void notifyObservers(Observable who, Object arg) {
	int i = size();

	while (--i >= 0) {
	    Observer o;

	    o = (Observer) elementAt(i);
	    o.update(who, arg);
	}
    }
}


/**
 * This class should be subclassed by observable object, or "data"
 * in the Model-View paradigm.  An Observable object may have any
 * number of Observers.  Whenever the Observable instance changes, it
 * notifies all of its observers.  Notification is done by calling
 * the update() method on all observers.
 *
 * @version 	1.13, 12/15/95
 * @author	Chris Warth
 */
public class Observable {
    private boolean changed = false;
    private Object obs;

    /**
     * Adds an observer to the observer list.
     * @param o the observer to be added
     */
    public synchronized void addObserver(Observer o) {
	if (obs != null) {
	    if (obs instanceof ObserverList) {
		if (!((ObserverList) obs).contains(o)) {
		    ((ObserverList) obs).addElement(o);
		}
	    } else if (obs != o) {
		ObserverList tmp = new ObserverList();

		tmp.addElement(obs);
		tmp.addElement(o);
		obs = tmp;
	    }
	} else {
	    obs = o;
	}
    }

    /**
     * Deletes an observer from the observer list.
     * @param o the observer to be deleted
     */
    public synchronized void deleteObserver(Observer o) {
	if (obs == o) {
	    obs = null;
	} else if (obs != null && obs instanceof ObserverList) {
	    ((ObserverList) obs).removeElement(o);
	} 
    }

    /**
     * Notifies all observers if an observable change occurs.
     */
    public void notifyObservers() {
	notifyObservers(null);
    }

    /**
     * Notifies all observers of the specified observable change
     * which occurred.
     * @param arg what is being notified
     */
    public synchronized void notifyObservers(Object arg) {
	if (hasChanged()) {
	    if (obs != null) {
		if (obs instanceof ObserverList) {
		    ((ObserverList) obs).notifyObservers(this, arg);
		} else {
		    ((Observer) obs).update(this, arg);
		}
	    }
	    clearChanged();
	}
    }

    /**
     * Deletes observers from the observer list.
     */
    public synchronized void deleteObservers() {
	obs = null;
    }

    /**
     * Sets a flag to note an observable change.
     */
    protected synchronized void setChanged() {
	changed = true;
    }

    /**
     * Clears an observable change.
     */
    protected synchronized void clearChanged() {
	changed = false;
    }

    /**
     * Returns a true boolean if an observable change has occurred.
     */
    public synchronized boolean hasChanged() {
	return changed;
    }

    /**
     * Counts the number of observers.
     */
    public synchronized int countObservers() {
	if (obs != null) {
	    if (obs instanceof ObserverList) {
		return ((ObserverList)obs).size();
	    } else {
		return 1;
	    }
	}
	return 0;
    }
}
public interface Observer { 
    
    /**
     * Called when observers in the observable list need to be 
     * updated.
     * @param o the list of observers
     * @param arg the argument being notified
     */
    void update(Observable o, Object arg);
}





public
class Properties extends Hashtable {
    protected Properties defaults;

    /**
     * Creates an empty property list.
     */
    public Properties() {
	this(null);
    }

    /**
     * Creates an empty property list with specified defaults.
     * @param defaults the defaults
     */
    public Properties(Properties defaults) {
	this.defaults = defaults;
    }

    /**
     * Loads properties from an InputStream.
     * @param in the input stream
     * @exception IOException Error when reading from input stream.
     */
    public synchronized void load(InputStream in) throws IOException {
	in = Runtime.getRuntime().getLocalizedInputStream(in);

	int ch = in.read();
	while (true) {
	    switch (ch) {
	      case -1:
		return;

	      case '#':
	      case '!':
		do {
		    ch = in.read();
		} while ((ch >= 0) && (ch != '\n') && (ch != '\r'));
		continue;

	      case '\n':
	      case '\r':
	      case ' ':
	      case '\t':
		ch = in.read();
		continue;
	    }

	    // Read the key
	    StringBuffer key = new StringBuffer();
	    while ((ch >= 0) && (ch != '=') && (ch != ':') && 
		   (ch != ' ') && (ch != '\t') && (ch != '\n') && (ch != '\r')) {
		key.append((char)ch);
		ch = in.read();
	    }
	    while ((ch == ' ') && (ch == '\t')) {
		ch = in.read();
	    }
	    if ((ch == '=') || (ch == ':')) {
		ch = in.read();
	    }
	    while ((ch == ' ') && (ch == '\t')) {
		ch = in.read();
	    }

	    // Read the value
	    StringBuffer val = new StringBuffer();
	    while ((ch >= 0) && (ch != '\n') && (ch != '\r')) {
		if (ch == '\\') {
		    switch (ch = in.read()) {
		      case '\n': 
			while (((ch = in.read()) == ' ') || (ch == '\t'));
			continue;
		      case 't': ch = '\t'; break;
		      case 'n': ch = '\n'; break;
		      case 'r': ch = '\r'; break;
		      case 'u': {
			while ((ch = in.read()) == 'u');
			int d = 0;
		      loop:
			for (int i = 0 ; i < 4 ; i++, ch = in.read()) {
			    switch (ch) {
			      case '0': case '1': case '2': case '3': case '4':
			      case '5': case '6': case '7': case '8': case '9':
				d = (d << 4) + ch - '0';
				break;
			      case 'a': case 'b': case 'c': case 'd': case 'e': case 'f':
				d = (d << 4) + 10 + ch - 'a';
				break;
			      case 'A': case 'B': case 'C': case 'D': case 'E': case 'F':
				d = (d << 4) + 10 + ch - 'A';
				break;
			      default:
				break loop;
			    }	
			}
			ch = d;
		      }
		    }
		}
		val.append((char)ch);
		ch = in.read();
	    }

	    //System.out.println(key + " = '" + val + "'");
	    put(key.toString(), val.toString());
	}
    }

    /**
     * Save properties to an OutputStream. Use the header as
     * a comment at the top of the file.
     */
    public synchronized void save(OutputStream out, String header) {
	OutputStream localOut = Runtime.getRuntime().getLocalizedOutputStream(out);
	PrintStream prnt = new PrintStream(localOut, false);
	boolean localize = localOut != out;

	if (header != null) {
	    prnt.write('#');
	    prnt.println(header);
	}
	prnt.write('#');
	prnt.println(new Date());

	for (Enumeration e = keys() ; e.hasMoreElements() ;) {
	    String key = (String)e.nextElement();
	    prnt.print(key);
	    prnt.write('=');

	    String val = (String)get(key);
	    int len = val.length();
	    boolean empty = false;

	    for (int i = 0 ; i < len ; i++) {
		int ch = val.charAt(i);

		switch (ch) {
		  case '\\': prnt.write('\\'); prnt.write('\\'); break;
		  case '\t': prnt.write('\\'); prnt.write('t'); break;
		  case '\n': prnt.write('\\'); prnt.write('n'); break;
		  case '\r': prnt.write('\\'); prnt.write('r'); break;

		  default:
		    if ((ch < ' ') || (ch >= 127) || (empty && (ch == ' '))) {
			if ((ch > 255) && localize) {
			    prnt.write(ch);
			} else {
			    prnt.write('\\');
			    prnt.write('u');
			    prnt.write((ch >> 12) & 0xF);
			    prnt.write((ch >>  8) & 0xF);
			    prnt.write((ch >>  4) & 0xF);
			    prnt.write((ch >>  0) & 0xF);
			}
		    } else {
			prnt.write(ch);
		    }
		}
		empty = false;
	    }
	    prnt.write('\n');
	}
    }

    /**
     * Gets a property with the specified key. If the key is not 
     * found in this property list, tries the defaults. This method 
     * returns null if the property is not found.
     * @param key the hashtable key
     */
    public String getProperty(String key) {
	String val = (String)super.get(key);
	return ((val == null) && (defaults != null)) ? defaults.getProperty(key) : val;
    }

    /**
     * Gets a property with the specified key and default. If the 
     * key is not found in this property list, tries the defaults. 
     * This method returns defaultValue if the property is not found.
     */
    public String getProperty(String key, String defaultValue) {
	String val = getProperty(key);
	return (val == null) ? defaultValue : val;
    }

    /**
     * Enumerates all the keys.
     */
    public Enumeration propertyNames() {
	Hashtable h = new Hashtable();
	enumerate(h);
	return h.keys();
    }

    /**
     * List properties, for debugging
     */
    public void list(PrintStream out) {
	out.println("-- listing properties --");
	Hashtable h = new Hashtable();
	enumerate(h);
	for (Enumeration e = h.keys() ; e.hasMoreElements() ;) {
	    String key = (String)e.nextElement();
	    String val = (String)h.get(key);
	    if (val.length() > 40) {
		val = val.substring(0, 37) + "...";
	    }
	    out.println(key + "=" + val);
	}
	
    }
    
    /**
     * Enumerates all key/value pairs in the specified hastable.
     * @param h the hashtable
     */
    private synchronized void enumerate(Hashtable h) {
	if (defaults != null) {
	    defaults.enumerate(h);
	}
	for (Enumeration e = keys() ; e.hasMoreElements() ;) {
	    String key = (String)e.nextElement();
	    h.put(key, get(key));
	}
    }
}

public
class Random {
    private long seed;
    private final static long multiplier = 0x5DEECE66DL;
    private final static long addend = 0xBL;
    private final static long mask = (1L << 48) - 1;

    /** 
     * Creates a new random number generator.  Its seed will be 
     * initialized to a value based on the current time.
     */
    public Random() { this(System.currentTimeMillis()); }

    /** 
     * Creates a new random number generator using a single 
     * <CODE>long</CODE> seed.
     * @param seed the initial seed
     * @see Random#setSeed
     */
    public Random(long seed) {
        setSeed(seed);
    	haveNextNextGaussian = false;
    }


    /**
     * Sets the seed of the random number generator using a single 
     * <CODE>long</CODE> seed.
     * @param seed the initial seed
     */
    synchronized public void setSeed(long seed) {
        this.seed = (seed ^ multiplier) & mask;
    }


    /**
     * Generates the next pseudorandom number.
     * @param bits random bits
     */
    synchronized private int next(int bits) {
        long nextseed = (seed * multiplier + addend) & mask;
        seed = nextseed;
        return (int)(nextseed >>> (48 - bits));
    }

    /**
     * Generates a pseudorandom uniformally distributed 
     * <CODE>int</CODE> value.
     * @return an integer value.
     */
    public int nextInt() {  return next(32); }

    /**
     * Generate a pseudorandom uniformally distributed <CODE>long</CODE> value.
     * @return A long integer value
     */
    public long nextLong() {
        // it's okay that the bottom word remains signed.
        return (next(32) << 32L) + next(32);
    }

    /**
     * Generates a pseudorandom uniformally distributed 
     * <CODE>float</CODE> value between 0.0 and 1.0.
     * @return a <CODE>float</CODE> between 0.0 and 1.0 .
     */
    public float nextFloat() {
        int i = next(30);
        return i / ((float)(1 << 30));
    }

    /**
     * Generates a pseudorandom uniformally distributed 
     * <CODE>double</CODE> value between 0.0 and 1.0.
     * @return a <CODE>float</CODE> between 0.0 and 1.0 .
     */
    public double nextDouble() {
        long l = ((long)(next(27)) << 27) + next(27);
        return l / (double)(1L << 54);
    }

    private double nextNextGaussian;
    private boolean haveNextNextGaussian = false;

    /**
     * Generates a pseudorandom Gaussian distributed 
     * <CODE>double</CODE> value with mean 0.0 and standard 
     * deviation 1.0.
     * @return a Gaussian distributed <CODE>double</CODE>.
     */
    synchronized public double nextGaussian() {
        // See Knuth, ACP, Section 3.4.1 Algorithm C.
        if (haveNextNextGaussian) {
    	    haveNextNextGaussian = false;
    	    return nextNextGaussian;
    	} else {
            double v1, v2, s;
    	    do { 
                v1 = 2 * nextDouble() - 1; // between -1 and 1
            	v2 = 2 * nextDouble() - 1; // between -1 and 1 
                s = v1 * v1 + v2 * v2;
    	    } while (s >= 1);
    	    double multiplier = Math.sqrt(-2 * Math.log(s)/s);
    	    nextNextGaussian = v2 * multiplier;
    	    haveNextNextGaussian = true;
    	    return v1 * multiplier;
        }
    }
}     





public
class Stack extends Vector {
    /**
     * Pushes an item onto the stack.
     * @param item the item to be pushed on.
     */
    public Object push(Object item) {
	addElement(item);

	return item;
    }

    /**
     * Pops an item off the stack.
     * @exception EmptyStackException If the stack is empty.
     */
    public Object pop() {
	Object	obj;
	int	len = size();

	obj = peek();
	removeElementAt(len - 1);

	return obj;
    }

    /**
     * Peeks at the top of the stack.
     * @exception EmptyStackException If the stack is empty.
     */
    public Object peek() {
	int	len = size();

	if (len == 0)
	    throw new EmptyStackException();
	return elementAt(len - 1);
    }

    /**
     * Returns true if the stack is empty.
     */
    public boolean empty() {
	return size() == 0;
    }

    /**
     * Sees if an object is on the stack.
     * @param o the desired object
     * @return the distance from the top, or -1 if it is not found.
     */
    public int search(Object o) {
	int i = lastIndexOf(o);

	if (i >= 0) {
	    return size() - i;
	}
	return -1;
    }
}

public
class StringTokenizer implements Enumeration {
    private int currentPosition;
    private int maxPosition;
    private String str;
    private String delimiters;
    private boolean retTokens;

    /**
     * Constructs a StringTokenizer on the specified String, using the
     * specified delimiter set.
     * @param str	   the input String
     * @param delim        the delimiter String
     * @param returnTokens returns delimiters as tokens or skip them
     */
    public StringTokenizer(String str, String delim, boolean returnTokens) {
	currentPosition = 0;
	this.str = str;
	maxPosition = str.length();
	delimiters = delim;
	retTokens = returnTokens;
    }

    /**
     * Constructs a StringTokenizer on the specified String, using the
     * specified delimiter set.
     * @param str	the input String
     * @param delim the delimiter String
     */
    public StringTokenizer(String str, String delim) {
	this(str, delim, false);
    }

    /**
     * Constructs a StringTokenizer on the specified String, using the
     * default delimiter set (which is " \t\n\r").
     * @param str the String
     */
    public StringTokenizer(String str) {
	this(str, " \t\n\r", false);
    }

    /**
     * Skips delimiters.
     */
    private void skipDelimiters() {
	while (!retTokens &&
	       (currentPosition < maxPosition) &&
	       (delimiters.indexOf(str.charAt(currentPosition)) >= 0)) {
	    currentPosition++;
	}
    }

    /**
     * Returns true if more tokens exist.
     */
    public boolean hasMoreTokens() {
	skipDelimiters();
	return (currentPosition < maxPosition);
    }

    /**
     * Returns the next token of the String.
     * @exception NoSuchElementException If there are no more 
     * tokens in the String.
     */
    public String nextToken() {
	skipDelimiters();

	if (currentPosition >= maxPosition) {
	    throw new NoSuchElementException();
	}

	int start = currentPosition;
	while ((currentPosition < maxPosition) && 
	       (delimiters.indexOf(str.charAt(currentPosition)) < 0)) {
	    currentPosition++;
	}
	if (retTokens && (start == currentPosition) &&
	    (delimiters.indexOf(str.charAt(currentPosition)) >= 0)) {
	    currentPosition++;
	}
	return str.substring(start, currentPosition);
    }

    /**
     * Returns the next token, after switching to the new delimiter set.
     * The new delimiter set remains the default after this call.
     * @param delim the new delimiters
     */
    public String nextToken(String delim) {
	delimiters = delim;
	return nextToken();
    }

    /**
     * Returns true if the Enumeration has more elements.
     */
    public boolean hasMoreElements() {
	return hasMoreTokens();
    }

    /**
     * Returns the next element in the Enumeration.
     * @exception NoSuchElementException If there are no more elements 
     * in the enumeration.
     */
    public Object nextElement() {
	return nextToken();
    }

    /**
     * Returns the next number of tokens in the String using
     * the current deliminter set.  This is the number of times
     * nextToken() can return before it will generate an exception.
     * Use of this routine to count the number of tokens is faster
     * than repeatedly calling nextToken() because the substrings
     * are not constructed and returned for each token.
     */
    public int countTokens() {
	int count = 0;
	int currpos = currentPosition;

	while (currpos < maxPosition) {
	    /*
	     * This is just skipDelimiters(); but it does not affect
	     * currentPosition.
	     */
	    while (!retTokens &&
		   (currpos < maxPosition) &&
		   (delimiters.indexOf(str.charAt(currpos)) >= 0)) {
		currpos++;
	    }

	    if (currpos >= maxPosition) {
		break;
	    }

	    int start = currpos;
	    while ((currpos < maxPosition) && 
		   (delimiters.indexOf(str.charAt(currpos)) < 0)) {
		currpos++;
	    }
	    if (retTokens && (start == currpos) &&
		(delimiters.indexOf(str.charAt(currpos)) >= 0)) {
		currpos++;
	    }
	    count++;

	}
	return count;
    }
}



public
class Vector implements Cloneable {
    /**
     * The buffer where elements are stored.
     */
    protected Object elementData[];

    /**
     * The number of elements in the buffer.
     */
    protected int elementCount;

    /**
     * The size of the increment. If it is 0 the size of the
     * the buffer is doubled everytime it needs to grow.
     */
    protected int capacityIncrement;

    /**
     * Constructs an empty vector with the specified storage
     * capacity and the specified capacityIncrement.
     * @param initialCapacity the initial storage capacity of the vector
     * @param capacityIncrement how much to increase the element's 
     * size by.
     */
    public Vector(int initialCapacity, int capacityIncrement) {
	super();
	this.elementData = new Object[initialCapacity];
	this.capacityIncrement = capacityIncrement;
    }

    /**
     * Constructs an empty vector with the specified storage capacity.
     * @param initialCapacity the initial storage capacity of the vector
     */
    public Vector(int initialCapacity) {
	this(initialCapacity, 0);
    }

    /**
     * Constructs an empty vector.
     */
    public Vector() {
	this(10);
    }


    /**
     * Copies the elements of this vector into the specified array.
     * @param anArray the array where elements get copied into
     */
    public final synchronized void copyInto(Object anArray[]) {
	int i = elementCount;
	while (i-- > 0) {
	    anArray[i] = elementData[i];
	}
    }

    /**
     * Trims the vector's capacity down to size. Use this operation to
     * minimize the storage of a vector. Subsequent insertions will
     * cause reallocation.
     */
    public final synchronized void trimToSize() {
	int oldCapacity = elementData.length;
	if (elementCount < oldCapacity) {
	    Object oldData[] = elementData;
	    elementData = new Object[elementCount];
	    System.arraycopy(oldData, 0, elementData, 0, elementCount);
	}
    }

    /**
     * Ensures that the vector has at least the specified capacity.
     * @param minCapacity the desired minimum capacity
     */
    public final synchronized void ensureCapacity(int minCapacity) {
	int oldCapacity = elementData.length;
	if (minCapacity > oldCapacity) {
	    Object oldData[] = elementData;
	    int newCapacity = (capacityIncrement > 0) ?
		(oldCapacity + capacityIncrement) : (oldCapacity * 2);
    	    if (newCapacity < minCapacity) {
		newCapacity = minCapacity;
	    }
	    elementData = new Object[newCapacity];
	    System.arraycopy(oldData, 0, elementData, 0, elementCount);
	}
    }

    /**
     * Sets the size of the vector. If the size shrinks, the extra elements
     * (at the end of the vector) are lost; if the size increases, the
     * new elements are set to null.
     * @param newSize the new size of the vector
     */
    public final synchronized void setSize(int newSize) {
	if (newSize > elementCount) {
	    ensureCapacity(newSize);
	} else {
	    for (int i = newSize ; i < elementCount ; i++) {
		elementData[i] = null;
	    }
	}
	elementCount = newSize;
    }

    /**
     * Returns the current capacity of the vector.
     */
    public final int capacity() {
	return elementData.length;
    }

    /**
     * Returns the number of elements in the vector.
     * Note that this is not the same as the vector's capacity.
     */
    public final int size() {
	return elementCount;
    }

    /**
     * Returns true if the collection contains no values.
     */
    public final boolean isEmpty() {
	return elementCount == 0;
    }

    /**
     * Returns an enumeration of the elements. Use the Enumeration methods on
     * the returned object to fetch the elements sequentially.
     */
    public final synchronized Enumeration elements() {
	return new VectorEnumerator(this);
    }
    
    /**
     * Returns true if the specified object is a value of the 
     * collection.
     * @param elem the desired element
     */
    public final boolean contains(Object elem) {
	return indexOf(elem, 0) >= 0;
    }

    /**
     * Searches for the specified object, starting from the first position
     * and returns an index to it.
     * @param elem the desired element
     * @return the index of the element, or -1 if it was not found.
     */
    public final int indexOf(Object elem) {
	return indexOf(elem, 0);
    }

    /**
     * Searches for the specified object, starting at the specified 
     * position and returns an index to it.
     * @param elem the desired element
     * @param index the index where to start searching
     * @return the index of the element, or -1 if it was not found.
     */
    public final synchronized int indexOf(Object elem, int index) {
	for (int i = index ; i < elementCount ; i++) {
	    if (elem.equals(elementData[i])) {
		return i;
	    }
	}
	return -1;
    }

    /**
     * Searches backwards for the specified object, starting from the last
     * position and returns an index to it. 
     * @param elem the desired element
     * @return the index of the element, or -1 if it was not found.
     */
    public final int lastIndexOf(Object elem) {
	return lastIndexOf(elem, elementCount);
    }

    /**
     * Searches backwards for the specified object, starting from the specified
     * position and returns an index to it. 
     * @param elem the desired element
     * @param index the index where to start searching
     * @return the index of the element, or -1 if it was not found.
     */
    public final synchronized int lastIndexOf(Object elem, int index) {
	for (int i = index ; --i >= 0 ; ) {
	    if (elem.equals(elementData[i])) {
		return i;
	    }
	}
	return -1;
    }

    /**
     * Returns the element at the specified index.
     * @param index the index of the desired element
     * @exception ArrayIndexOutOfBoundsException If an invalid 
     * index was given.
     */
    public final synchronized Object elementAt(int index) {
	if (index >= elementCount) {
	    throw new ArrayIndexOutOfBoundsException(index + " >= " + elementCount);
	}
	/* Since try/catch is free, except when the exception is thrown,
	   put in this extra try/catch to catch negative indexes and
	   display a more informative error message.  This might not
	   be appropriate, especially if we have a decent debugging
	   environment - JP. */
	try {
	    return elementData[index];
	} catch (ArrayIndexOutOfBoundsException e) {
	    throw new ArrayIndexOutOfBoundsException(index + " < 0");
	}
    }

    /**
     * Returns the first element of the sequence.
     * @exception NoSuchElementException If the sequence is empty.
     */
    public final synchronized Object firstElement() {
	if (elementCount == 0) {
	    throw new NoSuchElementException();
	}
	return elementData[0];
    }

    /**
     * Returns the last element of the sequence.
     * @exception NoSuchElementException If the sequence is empty.
     */
    public final synchronized Object lastElement() {
	if (elementCount == 0) {
	    throw new NoSuchElementException();
	}
	return elementData[elementCount - 1];
    }

    /**
     * Sets the element at the specified index to be the specified object.
     * The previous element at that position is discarded.
     * @param obj what the element is to be set to
     * @param index the specified index
     * @exception ArrayIndexOutOfBoundsException If the index was 
     * invalid.
     */
    public final synchronized void setElementAt(Object obj, int index) {
	if (index >= elementCount) {
	    throw new ArrayIndexOutOfBoundsException(index + " >= " + 
						     elementCount);
	}
	elementData[index] = obj;
    }

    /**
     * Deletes the element at the specified index. Elements with an index
     * greater than the current index are moved down.
     * @param index the element to remove
     * @exception ArrayIndexOutOfBoundsException If the index was invalid.
     */
    public final synchronized void removeElementAt(int index) {
	if (index >= elementCount) {
	    throw new ArrayIndexOutOfBoundsException(index + " >= " + 
						     elementCount);
	}
	int j = elementCount - index - 1;
	if (j > 0) {
	    System.arraycopy(elementData, index + 1, elementData, index, j);
	}
	elementCount--;
	elementData[elementCount] = null; /* to let gc do its work */
    }

    /**
     * Inserts the specified object as an element at the specified index.
     * Elements with an index greater or equal to the current index 
     * are shifted up.
     * @param obj the element to insert
     * @param index where to insert the new element
     * @exception ArrayIndexOutOfBoundsException If the index was invalid.
     */
    public final synchronized void insertElementAt(Object obj, int index) {
	if (index >= elementCount + 1) {
	    throw new ArrayIndexOutOfBoundsException(index + " >= " + 
						     elementCount + 1);
	}
	ensureCapacity(elementCount + 1);
	System.arraycopy(elementData, index, elementData, index + 1, elementCount - index);
	elementData[index] = obj;
	elementCount++;
    }

    /**
     * Adds the specified object as the last element of the vector.
     * @param obj the element to be added
     */
    public final synchronized void addElement(Object obj) {
	ensureCapacity(elementCount + 1);
	elementData[elementCount++] = obj;
    }

    /**
     * Removes the element from the vector. If the object occurs more
     * than once, only the first is removed. If the object is not an
     * element, returns false.
     * @param obj the element to be removed
     * @return true if the element was actually removed; false otherwise.
     */
    public final synchronized boolean removeElement(Object obj) {
	int i = indexOf(obj);
	if (i >= 0) {
	    removeElementAt(i);
	    return true;
	}
	return false;
    }

    /**
     * Removes all elements of the vector. The vector becomes empty.
     */
    public final synchronized void removeAllElements() {
	for (int i = 0; i < elementCount; i++) {
	    elementData[i] = null;
	}
	elementCount = 0;
    }

    /**
     * Clones this vector. The elements are <strong>not</strong> cloned.
     */
    public synchronized Object clone() {
	try { 
	    Vector v = (Vector)super.clone();
	    v.elementData = new Object[elementCount];
	    System.arraycopy(elementData, 0, v.elementData, 0, elementCount);
	    return v;
	} catch (CloneNotSupportedException e) { 
	    // this shouldn't happen, since we are Cloneable
	    throw new InternalError();
	}
    }

    /**
     * Converts the vector to a string. Useful for debugging.
     */
    public final synchronized String toString() {
	int max = size() - 1;
	StringBuffer buf = new StringBuffer();
	Enumeration e = elements();
	buf.append("[");

	for (int i = 0 ; i <= max ; i++) {
	    String s = e.nextElement().toString();
	    buf.append(s);
	    if (i < max) {
		buf.append(", ");
	    }
	}
	buf.append("]");
	return buf.toString();
    }
}

final
class VectorEnumerator implements Enumeration {
    Vector vector;
    int count;

    VectorEnumerator(Vector v) {
	vector = v;
	count = 0;
    }

    public boolean hasMoreElements() {
	return count < vector.elementCount;
    }

    public Object nextElement() {
	synchronized (vector) {
	    if (count < vector.elementCount) {
		return vector.elementData[count++];
	    }
	}
	throw new NoSuchElementException("VectorEnumerator");
    }

}



public class Throwable {
    /**
     * Native code saves some indication of the stack backtrace in this
     * slot.
     */
    private Object backtrace;	
    
    /**
     * Specific details about the Throwable.  For example,
     * for FileNotFoundThrowables, this contains the name of
     * the file that could not be found.
     */
    private String detailMessage;

    /**
     * Constructs a new Throwable with no detail message. The stack
     * trace is automatically filled in.
     */
    public Throwable() {
	fillInStackTrace();
    }

    /**
     * Constructs a new Throwable with the specified detail message.
     * The stack trace is automatically filled in.
     * @param message	the detailed message
     */
    public Throwable(String message) {
	fillInStackTrace();
	detailMessage = message;
    }

    /**
     * Gets the detail message of the Throwable.  A detail message
     * is a String that describes the Throwable that has taken place.
     * @return the detail message of the throwable.
     */
    public String getMessage() {
	return detailMessage;
    }

    /**
     * Returns a short description of the Throwable.
     */
    public String toString() {
	String s = getClass().getName();
	String message = getMessage();
	return (message != null) ? (s + ": " + message) : s;
    }

    /**
     * Prints the Throwable and the Throwable's stack trace.
     */
    public void printStackTrace() { 
        System.err.println(this);
	printStackTrace0(System.err);
    }

    public void printStackTrace(java.io.PrintStream s) { 
        s.println(this);
	printStackTrace0(s);
    }

    private native void printStackTrace0(java.io.PrintStream s);

    /**
     * Fills in the excecution stack trace. This is useful only
     * when rethrowing a Throwable. For example:
     * <p>
     * <pre>
     *	   try {
     *	        a = b / c;
     *	   } catch(ArithmeticThrowable e) {
     *		a = Number.MAX_VALUE;
     *	        throw e.fillInStackTrace();
     *	   }
     * </pre>
     * @return the Throwable itself.
     * @see Throwable#printStackTrace
     */
    public native Throwable fillInStackTrace();
}

















































public
class ClassFormatError extends LinkageError {
    /**
     * Constructs a ClassFormatError with no detail message.  A detail message
     * is a String that describes this particular exception.
     */
    public ClassFormatError() {
	super();
    }

    /**
     * Constructs a ClassFormatError with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the String containing the detail message
     */
    public ClassFormatError(String s) {
	super(s);
    }
}


public class ClassCircularityError extends LinkageError {
    /**
     * Constructs a ClassCircularityError with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public ClassCircularityError() {
	super();
    }

    /**
     * Constructs a ClassCircularityError with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the detail message
     */
    public ClassCircularityError(String s) {
	super(s);
    }
}


public
class ClassCastException extends RuntimeException {
    /**
     * Constructs a ClassCastException with no detail message.
     * A detail message is a String that describes this particular exception.
     */
    public ClassCastException() {
	super();
    }

    /**
     * Constructs a ClassCastException with the specified detail message.
     * A detail message is a String that describes this particular exception.
     * @param s the String containing a detail message
     */
    public ClassCastException(String s) {
	super(s);
    }
}




































public final
class Character extends Object {
    /**
     * The minimum radix available for conversion to and from Strings.  
     * The lowest minimum value that a radix can be is 2.
     * @see Integer#toString
     */
    public static final int MIN_RADIX = 2;

    /**
     * The maximum radix available for conversion to and from Strings.  The
     * largest maximum value that a radix can have is 36.
     * @see Integer#toString
     */
    public static final int MAX_RADIX = 36;

    static char downCase[]; /* case folding translation table upper => lower */
    static char upCase[]; /* case folding translation table lower => upper*/
    static {
        char down[] = new char[256];
        char up[] = new char[256];
        for (int i = 0 ; i < 256 ; i++) {
            down[i] = up[i] = (char) i;
	}
        for (int lower = 'a' ; lower <= 'z' ; lower++) {
            int upper = (lower + ('A' - 'a'));
            up[lower] = (char)upper;
            down[upper] = (char)lower;
	}

        for (int lower = 0xE0; lower <= 0xFE; lower++) {
            if (lower != 0xF7) { // multiply and divide
                int upper = (lower + ('A' - 'a'));
                up[lower] = (char)upper;
                down[upper] = (char)lower;
            }
        }
	downCase = down;
	upCase = up;
    }


    /**
     * Determines if the specified character is ISO-LATIN-1 lower case.
     * @param ch	the character to be tested
     * @return 	true if the character is lower case; false otherwise.
     */
    public static boolean isLowerCase(char ch) {
	// its a lower case if it has a different uppercase, or it is a
	// German double-S or Dutch ij.
	return ((ch <= '\u00FF') && 
		((upCase[ch] != ch) || (ch == '\u00df') || (ch == '\u00ff')));
    }
    
    /**
     * Determines if the specified character is ISO-LATIN-1 upper case.
     * @param ch	the character to be tested
     * @return 	true if the character is upper case; false otherwise.
     */
    public static boolean isUpperCase(char ch) {
	// it's upper case if it has a different lower case
        return (ch <= '\u00FF' && downCase[ch] != ch);
    }

    /**
     * Determines if the specified character is a ISO-LATIN-1 digit.
     * @param ch	the character to be tested
     * @return 	true if this character is a digit; false otherwise.
     */
    public static boolean isDigit(char ch) {
	return (ch >= '0') && (ch <= '9');
    }


    /**
     * Determines if the specified character is ISO-LATIN-1 white space according to Java.
     * @param ch		the character to be tested
     * @return  true if the character is white space; false otherwise.
     */
    public static boolean isSpace(char ch) {
	switch (ch) {
	case ' ':
	case '\t':
	case '\f': // form feed
	case '\n':
	case '\r':
		return (true);
	}
	return (false);
    }

    /**
     * Returns the lower case character value of the specified ISO-LATIN-1 
     * character. Characters that are not upper case letters are returned 
     * unmodified. 
     * @param ch	the character to be converted
     */
    public static char toLowerCase(char ch) {
	return (ch <= '\u00FF') ? downCase[ch] : ch;
    }

    /**
     * Returns the upper case character value of the specified ISO-LATIN-1 
     * character.
     * Characters that are not lower case letters are returned unmodified.
     *
     * Note that German ess-zed and latin small letter y diaeresis have no
     * corresponding upper case letters, even though they are lower case.
     * There is a capital y diaeresis, but not in ISO-LATIN-1...
     * @param ch	the character to be converted
     */
    public static char toUpperCase(char ch) {
	return (ch <= '\u00FF') ? upCase[ch] : ch;
    }

    /**
     * Returns the numeric value of the character digit using the specified
     * radix. If the character is not a valid digit, it returns -1.
     * @param ch		the character to be converted
     * @param radix 	the radix
     */
    public static int digit(char ch, int radix) {
	if (radix >= MIN_RADIX && radix <= MAX_RADIX) {
	    if (radix <= 10) {
		char max = (char)('0' + radix - 1);
		if ((ch >= '0') && (ch <= max)) {
		    return (ch - '0');
		}
	    } else {
		ch = toLowerCase(ch);
		if ((ch >= '0') && (ch <= '9')) {
		    return (ch - '0');
		} 

		char max = (char)('a' + radix - 11);
		if (ch >= 'a' && ch <= max) {
		    return (10 + ch - 'a');
		}
	    }
	}
        return -1;
    }

    /**
     * Returns the character value for the specified digit in the specified
     * radix. If the digit is not valid in the radix, the 0 character
     * is returned.
     * @param digit	the digit chosen by the character value
     * @param radix 	the radix containing the digit
     */
    public static char forDigit(int digit, int radix) {
	if ((digit >= radix) || (digit < 0)) {
	    return '\0';
	}
	if ((radix < MIN_RADIX) || (radix > MAX_RADIX)) {
	    return '\0';
	}
	if (digit < 10) {
	    return (char)('0' + digit);
	} 
	return (char)('a' + digit - 10);
    }

    /**
     * The value of the Character.
     */
    private char value;

    /**
     * Constructs a Character object with the specified value.
     * @param value value of this Character object
     */
    public Character(char value) {
	this.value = value;
    }

    /**
     * Returns the value of this Character object.
     */
    public char charValue() {
	return value;
    }

    /**
     * Returns a hashcode for this Character.
     */
    public int hashCode() {
	return (int)value;
    }

    /**
     * Compares this object against the specified object.
     * @param obj		the object to compare with
     * @return 		true if the objects are the same; false otherwise.
     */
    public boolean equals(Object obj) {
	if ((obj != null) && (obj instanceof Character)) {
	    return value == ((Character)obj).charValue();
	} 
	return false;
    }

    /**
     * Returns a String object representing this character's value.
     */
    public String toString() {
	char buf[] = {value};
	return String.valueOf(buf);
    }
}



public abstract class ColorModel {
    protected int pixel_bits;

    private static ColorModel RGBdefault;

    /**
     * Return a ColorModel which describes the default format for
     * integer RGB values used throughout the AWT image interfaces.
     * The format for the RGB values is an integer with 8 bits
     * each of alpha, red, green, and blue color components ordered
     * correspondingly from the most significant byte to the least
     * significant byte, as in:  0xAARRGGBB
     */
    public static ColorModel getRGBdefault() {
	if (RGBdefault == null) {
	    RGBdefault = new DirectColorModel(32,
					      0x00ff0000,	// Red
					      0x0000ff00,	// Green
					      0x000000ff,	// Blue
					      0xff000000	// Alpha
					      );
	}
	return RGBdefault;
    }

    /**
     * Constructs a ColorModel which describes a pixel of the specified
     * number of bits.
     */
    public ColorModel(int bits) {
	pixel_bits = bits;
    }

    /**
     * Returns the number of bits per pixel described by this ColorModel.
     */
    public int getPixelSize() {
	return pixel_bits;
    }

    /**
     * The subclass must provide a function which provides the red
     * color compoment for the specified pixel.
     * @return		The red color component ranging from 0 to 255
     */
    public abstract int getRed(int pixel);

    /**
     * The subclass must provide a function which provides the green
     * color compoment for the specified pixel.
     * @return		The green color component ranging from 0 to 255
     */
    public abstract int getGreen(int pixel);

    /**
     * The subclass must provide a function which provides the blue
     * color compoment for the specified pixel.
     * @return		The blue color component ranging from 0 to 255
     */
    public abstract int getBlue(int pixel);

    /**
     * The subclass must provide a function which provides the alpha
     * color compoment for the specified pixel.
     * @return		The alpha transparency value ranging from 0 to 255
     */
    public abstract int getAlpha(int pixel);

    /**
     * Returns the color of the pixel in the default RGB color model.
     * @see ColorModel#getRGBdefault
     */
    public int getRGB(int pixel) {
	return (getAlpha(pixel) << 24)
	    | (getRed(pixel) << 16)
	    | (getGreen(pixel) << 8)
	    | (getBlue(pixel) << 0);
    }
}










public class Insets implements Cloneable {

    /**
     * The inset from the top.
     */
    public int top;

    /**
     * The inset from the left.
     */
    public int left;

    /**
     * The inset from the bottom.
     */
    public int bottom;

    /**
     * The inset from the right.
     */
    public int right;

    /**
     * Constructs and initializes a new Inset with the specified top,
     * left, bottom, and right insets.
     * @param top the inset from the top
     * @param left the inset from the left
     * @param bottom the inset from the bottom
     * @param right the inset from the right
     */
    public Insets(int top, int left, int bottom, int right) {
	this.top = top;
	this.left = left;
	this.bottom = bottom;
	this.right = right;
    }

    /**
     * Returns a String object representing this Inset's values.
     */
    public String toString() {
	return getClass().getName() + "[top="  + top + ",left=" + left + ",bottom=" + bottom + ",right=" + right + "]";
    }

    public Object clone() { 
	try { 
	    return super.clone();
	} catch (CloneNotSupportedException e) { 
	    // this shouldn't happen, since we are Cloneable
	    throw new InternalError();
	}
    }
}



public interface ImageProducer {
    /**
     * This method is used to register an ImageConsumer with the
     * ImageProducer for access to the image data during a later
     * reconstruction of the Image.  The ImageProducer may, at its
     * discretion, start delivering the image data to the consumer
     * using the ImageConsumer interface immediately, or when the
     * next available image reconstruction is triggered by a call
     * to the startProduction method.
     * @see #startProduction
     */
    public void addConsumer(ImageConsumer ic);

    /**
     * This method determines if a given ImageConsumer object
     * is currently registered with this ImageProducer as one
     * of its consumers.
     */
    public boolean isConsumer(ImageConsumer ic);

    /**
     * This method removes the given ImageConsumer object
     * from the list of consumers currently registered to
     * receive image data.  It is not considered an error
     * to remove a consumer that is not currently registered.
     * The ImageProducer should stop sending data to this
     * consumer as soon as is feasible.
     */
    public void removeConsumer(ImageConsumer ic);

    /**
     * This method both registers the given ImageConsumer object
     * as a consumer and starts an immediate reconstruction of
     * the image data which will then be delivered to this
     * consumer and any other consumer which may have already
     * been registered with the producer.  This method differs
     * from the addConsumer method in that a reproduction of
     * the image data should be triggered as soon as possible.
     * @see #addConsumer
     */
    public void startProduction(ImageConsumer ic);

    /**
     * This method is used by an ImageConsumer to request that
     * the ImageProducer attempt to resend the image data one
     * more time in TOPDOWNLEFTRIGHT order so that higher
     * quality conversion algorithms which depend on receiving
     * pixels in order can be used to produce a better output
     * version of the image.  The ImageProducer is free to
     * ignore this call if it cannot resend the data in that
     * order.  If the data can be resent, then the ImageProducer
     * should respond by executing the following minimum set of
     * ImageConsumer method calls:
     * <pre>
     *	ic.setHints(TOPDOWNLEFTRIGHT | < otherhints >);
     *	ic.setPixels(...);	// As many times as needed
     *	ic.imageComplete();
     * </pre>
     * @see ImageConsumer#setHints
     */
    public void requestTopDownLeftRightResend(ImageConsumer ic);
}


public interface ImageObserver {
    /**
     * This method is called when information about an image which was
     * previously requested using an asynchronous interface becomes
     * available.  Asynchronous interfaces are method calls such as
     * getWidth(ImageObserver) and drawImage(img, x, y, ImageObserver)
     * which take an ImageObserver object as an argument.  Those methods
     * register the caller as interested either in information about
     * the overall image itself (in the case of getWidth(ImageObserver))
     * or about an output version of an image (in the case of the
     * drawImage(img, x, y, [w, h,] ImageObserver) call).  

     * <p>This method
     * should return true if further updates are needed or false if the
     * required information has been acquired.  The image which was being
     * tracked is passed in using the img argument.  Various constants
     * are combined to form the infoflags argument which indicates what
     * information about the image is now available.  The interpretation
     * of the x, y, width, and height arguments depends on the contents
     * of the infoflags argument.
     * @see Image#getWidth
     * @see Image#getHeight
     * @see java.awt.Graphics#drawImage
     */
    public boolean imageUpdate(Image img, int infoflags,
			       int x, int y, int width, int height);

    /**
     * The width of the base image is now available and can be taken
     * from the width argument to the imageUpdate callback method.
     * @see Image#getWidth
     * @see #imageUpdate
     */
    public static final int WIDTH = 1;

    /**
     * The height of the base image is now available and can be taken
     * from the height argument to the imageUpdate callback method.
     * @see Image#getHeight
     * @see #imageUpdate
     */
    public static final int HEIGHT = 2;

    /**
     * The properties of the image are now available.
     * @see Image#getProperty
     * @see #imageUpdate
     */
    public static final int PROPERTIES = 4;

    /**
     * More pixels needed for drawing a scaled variation of the image
     * are available.  The bounding box of the new pixels can be taken
     * from the x, y, width, and height arguments to the imageUpdate
     * callback method.
     * @see java.awt.Graphics#drawImage
     * @see #imageUpdate
     */
    public static final int SOMEBITS = 8;

    /**
     * Another complete frame of a multi-frame image which was previously
     * drawn is now available to be drawn again.  The x, y, width, and height
     * arguments to the imageUpdate callback method should be ignored.
     * @see java.awt.Graphics#drawImage
     * @see #imageUpdate
     */
    public static final int FRAMEBITS = 16;

    /**
     * A static image which was previously drawn is now complete and can
     * be drawn again in its final form.  The x, y, width, and height
     * arguments to the imageUpdate callback method should be ignored.
     * @see java.awt.Graphics#drawImage
     * @see #imageUpdate
     */
    public static final int ALLBITS = 32;

    /**
     * An image which was being tracked asynchronously has encountered
     * an error.  No further information will become available and
     * drawing the image will fail.
     * As a convenience, the ABORT flag will be indicated at the same
     * time to indicate that the image production was aborted.
     * @see #imageUpdate
     */
    public static final int ERROR = 64;

    /**
     * An image which was being tracked asynchronously was aborted before
     * production was complete.  No more information will become available
     * without further action to trigger another image production sequence.
     * If the ERROR flag was not also set in this image update, then
     * accessing any of the data in the image will restart the production
     * again, probably from the beginning.
     * @see #imageUpdate
     */
    public static final int ABORT = 128;
}



public abstract class Image {
    /**
     * Gets the actual width of the image.  If the width is not known
     * yet then the ImageObserver will be notified later and -1 will
     * be returned.
     * @see #getHeight
     * @see ImageObserver
     */
    public abstract int getWidth(ImageObserver observer);

    /**
     * Gets the actual height of the image.  If the height is not known
     * yet then the ImageObserver will be notified later and -1 will
     * be returned.
     * @see #getWidth
     * @see ImageObserver
     */
    public abstract int getHeight(ImageObserver observer);

    /**
     * Gets the object that produces the pixels for the image.
     * This is used by the Image filtering classes and by the
     * image conversion and scaling code.
     * @see ImageProducer
     */
    public abstract ImageProducer getSource();

    /**
     * Gets a graphics object to draw into this image.
     * This will only work for off-screen images.
     * @see Graphics
     */
    public abstract Graphics getGraphics();

    /**
     * Gets a property of the image by name.  Individual property names
     * are defined by the various image formats.  If a property is not
     * defined for a particular image, this method will return the
     * UndefinedProperty object.  If the properties for this image are
     * not yet known, then this method will return null and the ImageObserver
     * object will be notified later.  The property name "comment" should
     * be used to store an optional comment which can be presented to
     * the user as a description of the image, its source, or its author.
     * @see ImageObserver
     * @see #UndefinedProperty
     */
    public abstract Object getProperty(String name, ImageObserver observer);

    /**
     * The UndefinedProperty object should be returned whenever a
     * property which was not defined for a particular image is
     * fetched.
     */
    public static final Object UndefinedProperty = new Object();

    /**
     * Flushes all resources being used by this Image object.  This
     * includes any pixel data that is being cached for rendering to
     * the screen as well as any system resources that are being used
     * to store data or pixels for the image.  The image is reset to
     * a state similar to when it was first created so that if it is
     * again rendered, the image data will have to be recreated or
     * fetched again from its source.
     */
    public abstract void flush();
}


public abstract class FontMetrics {
    /**
     * The actual font.
     * @see #getFont
     */
    protected Font font;

    /**
     * Creates a new FontMetrics object with the specified font.
     * @param font the font
     * @see Font
     */
    protected FontMetrics(Font font) {
	this.font = font;
    }

    /**
     * Gets the font.
     */
    public Font getFont() {
	return font;
    }

    /**
     * Gets the standard leading, or line spacing, for the font.  
     * This is the logical amount of space to be reserved between the
     * descent of one line of text and the ascent of the next line.
     * The height metric is calculated to include this extra space.
     */
    public int getLeading() {
	return 0;
    }

    /**
     * Gets the font ascent. The font ascent is the distance from the 
     * base line to the top of the characters.
     * @see #getMaxAscent
     */
    public int getAscent() {
	return font.getSize();
    }

    /**
     * Gets the font descent. The font descent is the distance from the 
     * base line to the bottom of the characters.
     * @see #getMaxDescent
     */
    public int getDescent() {
	return 0;
    }

    /**
     * Gets the total height of the font.  This is the distance between
     * the baseline of adjacent lines of text.  It is the sum of the
     * leading + ascent + descent. 
     *  
     */
    public int getHeight() {
	return getLeading() + getAscent() + getDescent();
    }

    /**
     * Gets the maximum ascent of all characters in this Font.
     * No character will extend further above the baseline than this 
     * metric.
     * @see #getAscent
     */
    public int getMaxAscent() {
	return getAscent();
    }

    /**
     * Gets the maximum descent of all characters.  
     * No character will descend futher below the baseline than this
     * metric.
     * @see #getDescent
     */
    public int getMaxDescent() {
	return getDescent();
    }
    /**
     * For backward compatibility only.
     * @see #getMaxDescent
     */
    public int getMaxDecent() {
	return getMaxDescent();
    }

    /**
     * Gets the maximum advance width of any character in this Font. 
     * @return -1 if the max advance is not known.
     */
    public int getMaxAdvance() {
	return -1;
    }

    /** 
     * Returns the width of the specified character in this Font.
     * @param ch the specified font
     * @see #stringWidth
     */
    public int charWidth(int ch) {
	return charWidth((char)ch);
    }

    /** 
     * Returns the width of the specified character in this Font.
     * @param ch the specified font
     * @see #stringWidth
     */
    public int charWidth(char ch) {
	if (ch < 256) {
	    return getWidths()[ch];
	}
	char data[] = {ch};
	return charsWidth(data, 0, 1);
    }

    /** 
     * Returns the width of the specified String in this Font.
     * @param str the String to be checked
     * @see #charsWidth
     * @see #bytesWidth
     */
    public int stringWidth(String str) {
	int len = str.length();
	char data[] = new char[len];
	str.getChars(0, len, data, 0);
	return charsWidth(data, 0, len);
    }

    /** 
     * Returns the width of the specified character array in this Font.
     * @param data the data to be checked
     * @param off the start offset of the data
     * @param len the maximum number of bytes checked
     * @see #stringWidth
     * @see #bytesWidth
     */
    public int charsWidth(char data[], int off, int len) {
	return stringWidth(new String(data, off, len));
    }

    /** 
     * Returns the width of the specified array of bytes in this Font.
     * @param data the data to be checked
     * @param off the start offset of the data
     * @param len the maximum number of bytes checked
     * @see #stringWidth
     * @see #charsWidth
     */
    public int bytesWidth(byte data[], int off, int len) {
	return stringWidth(new String(data, 0, off, len));
    }

    /**
     * Gets the widths of the first 256 characters in the Font.
     */
    public int[] getWidths() {
	int widths[] = new int[256];
	for (char ch = 0 ; ch < 256 ; ch++) {
	    widths[ch] = charWidth(ch);
	}
	return widths;
    }

    /** 
     * Returns the String representation of this FontMetric's values.
     */
    public String toString() {
	return getClass().getName() + "[font=" + getFont() + "ascent=" +
	    getAscent() + ", descent=" + getDescent() + ", height=" + getHeight() + "]";
    }
}


// a class that produces font objects. 

public class Font {

    /* 
     * Constants to be used for styles. Can be combined to mix
     * styles. 
     */

    /**
     * The plain style constant.  This can be combined with the other style
     * constants for mixed styles.
     */
    public static final int PLAIN	= 0;

    /**
     * The bold style constant.  This can be combined with the other style
     * constants for mixed styles.
     */
    public static final int BOLD	= 1;

    /**
     * The italicized style constant.  This can be combined with the other
     * style constants for mixed styles.
     */
    public static final int ITALIC	= 2;

    /**
     * Private data.
     */
    private int pData;

    /** 
     * The platform specific family name of this font. 
     */
    private String family;

    /** 
     * The logical name of this font. 
     */
    protected String name;

    /** 
     * The style of the font. This is the sum of the
     * constants PLAIN, BOLD, or ITALIC. 
     */
    protected int style;

    /** 
     * The point size of this font. 
     */
    protected int size;

    /**
     * Creates a new font with the specified name, style and point size.
     * @param name the font name
     * @param style the constant style used
     * @param size the point size of the font
     * @see Toolkit#getFontList
     */
    public Font(String name, int style, int size) {
	this.family = System.getProperty("awt.font." + name.toLowerCase(), name);
	this.name = name;
	this.style = style;
	this.size = size;
    }

    /**
     * Gets the platform specific family name of the font.
     * Use getName to get the logical name of the font.
     * @see #getName
     */
    public String getFamily() {
	return family;
    }

    /**
     * Gets the logical name of the font.
     * @see #getFamily
     */
    public String getName() {
	return name;
    }

    /**
     * Gets the style of the font.
     * @see #isPlain
     * @see #isBold
     * @see #isItalic
     */
    public int getStyle() {
	return style;
    }

    /**
     * Gets the point size of the font.
     */
    public int getSize() {
	return size;
    }

    /**
     * Returns true if the font is plain.
     * @see #getStyle
     */
    public boolean isPlain() {
	return style == 0;
    }

    /**
     * Returns true if the font is bold.
     * @see #getStyle
     */
    public boolean isBold() {
	return (style & BOLD) != 0;
    }

    /**
     * Returns true if the font is italic.
     * @see #getStyle
     */
    public boolean isItalic() {
	return (style & ITALIC) != 0;
    }

    /**
     * Gets a font from the system properties list.
     * @param nm the property name
     */
    public static Font getFont(String nm) {
	return getFont(nm, null);
    }

    /**
     * Gets the specified font from the system properties list.
     * @param nm the property name
     * @param font a default font to return if property 'nm' is not defined
     */
    public static Font getFont(String nm, Font font) {
	String str = System.getProperty(nm);
	if (str == null) {
	    return font;
	}
	String fontName = str;
	int fontSize = 12;
	int fontStyle = Font.PLAIN;

	int i = str.indexOf('-');
	if (i >= 0) {
	    fontName = str.substring(0, i);
	    str = str.substring(i+1);
	    if ((i = str.indexOf('-')) >= 0) {
		if (str.startsWith("bold-")) {
		    fontStyle = Font.BOLD;
		} else if (str.startsWith("italic-")) {
		    fontStyle = Font.ITALIC;
		} else if (str.startsWith("bolditalic-")) {
		    fontStyle = Font.BOLD | Font.ITALIC;
		}
		str = str.substring(i + 1);
	    }
	    try {
		fontSize = Integer.valueOf(str).intValue();
	    } catch (NumberFormatException e) {
	    }
	}
	return new Font(fontName, fontStyle, fontSize);
    }

    /**
     * Returns a hashcode for this font.
     */
    public int hashCode() {
	return name.hashCode() ^ style ^ size;
    }
    
    /**
     * Compares this object to the specifed object.
     * @param obj the object to compare with
     * @return true if the objects are the same; false otherwise.
     */
    public boolean equals(Object obj) {
	if (obj instanceof Font) {
	    Font font = (Font)obj;
	    return (size == font.size) && (style == font.style) && name.equals(font.name);
	}
	return false;
    }

    /** 
     * Converts this object to a String representation. 
     */
    public String toString() {
	String	strStyle;

	if (isBold()) {
	    strStyle = isItalic() ? "bolditalic" : "bold";
	} else {
	    strStyle = isItalic() ? "italic" : "plain";
	}

	return getClass().getName() + "[family=" + family + ",name=" + name + ",style=" +
	    strStyle + ",size=" + size + "]";
    }
}
