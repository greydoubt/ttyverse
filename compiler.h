#
/*
 * C object code improver-- second part
 */

#include "c2.h"

rmove()
{
	register struct node *p;
	register int r;
	register  r1, flt;

	for (p=first.forw; p!=0; p = p->forw) {
	flt = 0;
	switch (p->op) {

	case MOVF:
	case MOVFO:
	case MOVOF:
		flt = NREG;

	case MOV:
		if (p->subop==BYTE)
			goto dble;
		dualop(p);
		if ((r = findrand(regs[RT1], flt)) >= 0) {
			if (r == flt+isreg(regs[RT2]) && p->forw->op!=CBR
			   && p->forw->op!=SXT
			   && p->forw->op!=CFCC) {
				p->forw->back = p->back;
				p->back->forw = p->forw;
				redunm++;
				nchange++;
				continue;
			}
		}
		if (equstr(regs[RT1], "$0")) {
			p->op = CLR;
			strcpy(regs[RT1], regs[RT2]);
			regs[RT2][0] = 0;
			p->code = copy(1, regs[RT1]);
			nchange++;
			goto sngl;
		}
		repladdr(p, 0, flt);
		r = isreg(regs[RT1]);
		r1 = isreg(regs[RT2]);
		dest(regs[RT2], flt);
		if (r >= 0)
			if (r1 >= 0)
				savereg(r1+flt, regs[r+flt]);
			else
				savereg(r+flt, regs[RT2]);
		else
			if (r1 >= 0)
				savereg(r1+flt, regs[RT1]);
			else
				setcon(regs[RT1], regs[RT2]);
		source(regs[RT1]);
		setcc(regs[RT2]);
		continue;

	case ADDF:
	case SUBF:
	case DIVF:
	case MULF:
		flt = NREG;
		goto dble;

	case ADD:
	case SUB:
	case BIC:
	case BIS:
	case MUL:
	case DIV:
	case ASH:
	dble:
		dualop(p);
		if (p->op==BIC && (equstr(regs[RT1], "$-1") || equstr(regs[RT1], "$177777"))) {
			p->op = CLR;
			strcpy(regs[RT1], regs[RT2]);
			regs[RT2][0] = 0;
			p->code = copy(1, regs[RT1]);
			nchange++;
			goto sngl;
		}
		if ((p->op==BIC || p->op==BIS) && equstr(regs[RT1], "$0")) {
			if (p->forw->op!=CBR) {
				p->back->forw = p->forw;
				p->forw->back = p->back;
				nchange++;
				continue;
			}
		}
/*
 * the next block of code looks for the sequences (which extract the
 * high byte of a word or the low byte respectively):
 *	ash $-10,r
 *	bic $-400,r
 * or 
 *	mov natural,r
 *	bic $-400,r
 * and transforms them into:
 *	clrb r
 *	swab r
 * or
 *	clr r
 *	bisb natural,r
 * These constructs occur often enough in the kernel (dealing with major/minor 
 * device numbers, etc) it's worth a little extra work at compile time.
*/
		if (p->op == BIC && (equstr(regs[RT1],"$-400") || 
			 equstr(regs[RT1],"$-177400"))) {
			if (p->back->op == ASH) {
				r = isreg(regs[RT2]);
				dualop(p->back);
				if ((equstr(regs[RT1], "$-10") || 
				     equstr(regs[RT1], "$177770")) && 
				    r == isreg(regs[RT2])) {
					strcpy(regs[RT1], regs[RT2]);
					regs[RT2][0] = 0;
					p->back->op = CLR;
					p->back->subop = BYTE;
					p->back->code = copy(1, regs[RT1]);
					p->op = SWAB;
					p->code = copy(1, regs[RT1]);
					nchange++;
					goto sngl;
				}
			}
			else if (p->back->op == MOV && p->forw->op != CBR) {
				char temp[50];

				r = isreg(regs[RT2]);
				if (r < 0 && !xnatural(regs[RT2]))
					goto out;
				strcpy(temp, regs[RT2]);
				dualop(p->back);
				if (isreg(regs[RT2]) == r && natural(regs[RT1])) {
			 	    if (r < 0 && (!xnatural(regs[RT2]) || !equstr(temp, regs[RT2])))
					goto out;
/*
 * XXX - the sequence "movb rN,rN; bic $-400,rN" can not be transformed
 * because the 'clr' would lose all information about 'rN'.  The best that can 
 * be done is to remove the 'movb' instruction and leave the 'bic'.
*/
				    if (isreg(regs[RT1]) == r && r >= 0) {
					    p = p->back;
					    p->forw->back = p->back;
					    p->back->forw = p->forw;
					    nchange++;
					    continue;
				    }
				    dest(regs[RT1], flt);
				    p->back->op = CLR;
				    p->back->subop = 0;
				    p->back->code = copy(1, regs[RT2]);
				    p->op = BIS;
				    p->subop = BYTE;
				    strcat(regs[RT1], ",");
				    p->code = copy(2, regs[RT1], regs[RT2]);
				    nchange++;
				}
			}
out:		dualop(p);	/* restore banged up parsed operands */
		}
		repladdr(p, 0, flt);
		source(regs[RT1]);
		dest(regs[RT2], flt);
		if (p->op==DIV && (r = isreg(regs[RT2]))>=0)
			regs[r|1][0] = 0;
		switch	(p->op)
			{
			case	ADD:
			case	SUB:
			case	BIC:
			case	BIS:
			case	ASH:
				setcc(regs[RT2]);
				break;
			default:
				ccloc[0] = 0;
			}
		continue;

	case SXT:
		singop(p);
		if (p->forw->op == CLR && p->forw->subop != BYTE &&
			xnatural(regs[RT1]) && !strcmp(p->code, p->forw->code)){
			p->forw->back = p->back;
			p->back->forw = p->forw;
			nchange++;
			continue;
		}
		goto sngl;
	case CLRF:
	case NEGF:
		flt = NREG;

	case CLR:
	case COM:
	case INC:
	case DEC:
	case NEG:
	case ASR:
	case ASL:
	case SWAB:
		singop(p);
	sngl:
		dest(regs[RT1], flt);
		if (p->op==CLR && flt==0)
			{
			if ((r = isreg(regs[RT1])) >= 0)
				savereg(r, "$0");
			else
				setcon("$0", regs[RT1]);
			ccloc[0] = 0;
			}
		else
			setcc(regs[RT1]);
		continue;

	case TSTF:
		flt = NREG;

	case TST:
		singop(p);
		repladdr(p, 0, flt);
		source(regs[RT1]);
		if (p->back->op == TST && !flt && not_sp(regs[RT1])) {
			char rt1[MAXCPS + 2];
			strcpy(rt1, regs[RT1]);
			singop(p->back);
			if (!strcmp("(sp)+", regs[RT1])) {
				p->back->subop = p->subop;
				p->back->forw = p->forw;
				p->forw->back = p->back;
				p = p->back;
				p->op = MOV;
				p->code = copy(2, rt1, ",(sp)+");
				nrtst++;
				nchange++;
				continue;
			}
		singop(p);
		}
		if (p->back->op == MOV && p->back->subop == BYTE) {
			dualop(p->back);
			setcc(regs[RT2]);
			singop(p);
		}
		if (equstr(regs[RT1], ccloc) && p->subop == p->back->subop) {
			p->back->forw = p->forw;
			p->forw->back = p->back;
			p = p->back;
			nrtst++;
			nchange++;
		}
		else
			setcc(regs[RT1]); /* XXX - double TST in a row */
		continue;

	case CMPF:
		flt = NREG;

	case CMP:
	case BIT:
		dualop(p);
		source(regs[RT1]);
		source(regs[RT2]);
		if(p->op==BIT) {
			if (equstr(regs[RT1], "$-1") || equstr(regs[RT1], "$177777")) {
				p->op = TST;
				strcpy(regs[RT1], regs[RT2]);
				regs[RT2][0] = 0;
				p->code = copy(1, regs[RT1]);
				nchange++;
				nsaddr++;
			} else if (equstr(regs[RT2], "$-1") || equstr(regs[RT2], "$177777")) {
				p->op = TST;
				regs[RT2][0] = 0;
				p->code = copy(1, regs[RT1]);
				nchange++;
				nsaddr++;
			}
			if (equstr(regs[RT1], "$0")) {
				p->op = TST;
				regs[RT2][0] = 0;
				p->code = copy(1, regs[RT1]);
				nchange++;
				nsaddr++;
			} else if (equstr(regs[RT2], "$0")) {
				p->op = TST;
				strcpy(regs[RT1], regs[RT2]);
				regs[RT2][0] = 0;
				p->code = copy(1, regs[RT1]);
				nchange++;
				nsaddr++;
			}
		}
		repladdr(p, 1, flt);
		ccloc[0] = 0;
		continue;

	case CBR:
		r = -1;
		if (p->back->op==TST || p->back->op==CMP) {
			if (p->back->op==TST) {
				singop(p->back);
				savereg(RT2, "$0");
			} else
				dualop(p->back);
			if (equstr(regs[RT1], regs[RT2])
			 && natural(regs[RT1]) && natural(regs[RT2]))
				r = compare(p->subop, "$1", "$1");
			else
				r = compare(p->subop, findcon(RT1), findcon(RT2));
			if (r==0) {
				if (p->forw->op==CBR
				  || p->forw->op==SXT
				  || p->forw->op==CFCC) {
					p->back->forw = p->forw;
					p->forw->back = p->back;
				} else {
					p->back->back->forw = p->forw;
					p->forw->back = p->back->back;
				}
				decref(p->ref);
				p = p->back->back;
				nchange++;
			} else if (r>0) {
				p->op = JBR;
				p->subop = 0;
				p->back->back->forw = p;
				p->back = p->back->back;
				p = p->back;
				nchange++;
			}
/*
 * If the instruction prior to the conditional branch was a 'tst' then
 * save the condition code status.  The C construct:
 * 		if (x) 
 *		   if (x > 0)
 * generates "tst _x; jeq ...; tst _x; jmi ...;jeq ...".  The code below removes
 * the second "tst _x", leaving "tst _x; jeq ...;jmi ...; jeq ...".
*/
			if (p->back->op == TST) {
				singop(p->back);
				setcc(regs[RT1]);
				break;
			}
		}
/*
 * If the previous instruction was also a conditional branch then
 * attempt to merge the two into a single branch.
*/
		if (p->back->op == CBR)
			fixupbr(p);
	case CFCC:
		ccloc[0] = 0;
		continue;

/*
 * Unrecognized (unparsed) instructions, assignments (~foo=r2), and
 * data arrive here.  In order to prevent throwing away information
 * about register contents just because a local assignment is done
 * we check for the first character being a tilde.
*/
	case 0:
		if (p->code[0] != '~')
			clearreg();
		continue;

	case JBR:
		redunbr(p);

	default:
		clearreg();
	}
	}
}

/*
 * This table(( is used to convert two branches to the same label after a 
 * 'tst' (which clears the C and V condition codes) into a single branch.
 * Entries which translate to JBR could eventually cause the 'tst' instruction 
 * to be eliminated as well, but that can wait for now.  There are unused or
 * impossible combinations ('tst' followed by 'jlo' for example.  since
 * 'tst' clears C it makes little sense to 'jlo/bcs') in the table, it 
 * would have cost more in code to remove them than the entries themselves.
 *
 * Example:  "tst _x; jmi L3; jeq L3".  Find the row for 'jmi', then look
 * at the column for 'jeq', the resulting "opcode" is 'jle'.
*/
	char	brtable[12][12] = {
	/* jeq  jne  jle  jge  jlt  jgt  jlo  jhi  jlos jhis jpl  jmi */
/* jeq */ {JEQ ,JBR ,JLE ,JGE ,JLE ,JGE ,JEQ ,JBR ,JEQ ,JBR ,JGE ,JLE},
/* jne */ {JBR ,JNE ,JBR ,JBR ,JNE ,JNE ,JNE ,JNE ,JBR ,JBR ,JBR ,JNE},
/* jle */ {JLE ,JBR ,JLE ,JBR ,JLE ,JBR ,JLE ,JBR ,JLE ,JBR ,JBR ,JLE},
/* jge */ {JGE ,JBR ,JBR ,JGE ,JBR ,JGE ,JGE ,JBR ,JGE ,JBR ,JGE ,JBR},
/* jlt */ {JLE ,JNE ,JLE ,JBR ,JLT ,JNE ,JLT ,JBR ,JLE ,JBR ,JBR ,JLT},
/* jgt */ {JGE ,JNE ,JBR ,JGE ,JNE ,JGT ,JGT ,JGT ,JBR ,JGE ,JGE ,JNE},
/* jlo */ {JEQ ,JNE ,JLE ,JGE ,JLT ,JGT ,JLO ,JHI ,JLOS,JHIS,JPL ,JMI},
/* jhi */ {JBR ,JNE ,JBR ,JBR ,JNE ,JNE ,JNE ,JNE ,JBR ,JBR ,JBR ,JNE},
/* jlos*/ {JEQ ,JBR ,JLE ,JGE ,JLE ,JGE ,JLE ,JBR ,JEQ ,JBR ,JGE ,JLE},
/* jhis*/ {JBR ,JBR ,JBR ,JBR ,JBR ,JBR ,JBR ,JBR ,JBR ,JBR ,JBR ,JBR},
/* jpl */ {JGE ,JBR ,JBR ,JGE ,JBR ,JGE ,JGE ,JBR ,JGE ,JBR ,JGE ,JBR},
/* jmi */ {JLE ,JNE ,JLE ,JBR ,JLT ,JNE ,JLT ,JNE ,JLE ,JLT ,JBR ,JLT}
	  };

fixupbr(p)
	register struct node *p;
{
	register struct node *p1, *p2;
	int op;

	p1 = p->back;
	p2 = p1->back;
	if (p->labno != p1->labno)
		return;
	if (p2->op != TST) {
		if (p2->op == CBR && p2->back->op == TST)
			goto ok;
		return;
	}
ok:	p->subop = brtable[p->subop][p1->subop];
	nchange++;
	nredunj++;
	p2->forw = p;
	p->back = p1->back;
	}

jumpsw()
{
	register struct node *p, *p1;
	register t;
	register struct node *tp;
	int nj;

	t = 0;
	nj = 0;
	for (p=first.forw; p!=0; p = p->forw)
		p->refc = ++t;
	for (p=first.forw; p!=0; p = p1) {
		p1 = p->forw;
		if (p->op == CBR && p1->op==JBR && p->ref && p1->ref
		 && abs(p->refc - p->ref->refc) > abs(p1->refc - p1->ref->refc)) {
			if (p->ref==p1->ref)
				continue;
			p->subop = revbr[p->subop];
			tp = p1->ref;
			p1->ref = p->ref;
			p->ref = tp;
			t = p1->labno;
			p1->labno = p->labno;
			p->labno = t;
			nrevbr++;
			nj++;
		}
	}
	return(nj);
}

addsob()
{
	register struct node *p, *p1;

	for (p = &first; (p1 = p->forw)!=0; p = p1) {
		if (p->op==DEC && isreg(p->code)>=0
		 && p1->op==CBR && p1->subop==JNE) {
			if (p->refc < p1->ref->refc)
				continue;
			if (toofar(p1))
				continue;
			p->labno = p1->labno;
			p->op = SOB;
			p->subop = 0;
			p1->forw->back = p;
			p->forw = p1->forw;
			nsob++;
		}
	}
}

toofar(p)
struct node *p;
{
	register struct node *p1;
	int len;

	len = 0;
	for (p1 = p->ref; p1 && p1!=p; p1 = p1->forw)
		len += ilen(p1);
	if (len < 128)
		return(0);
	return(1);
}

ilen(p)
register struct node *p;
{

	switch (p->op) {
	case LABEL:
	case DLABEL:
	case TEXT:
	case EROU:
	case EVEN:
		return(0);

	case CBR:
		return(6);

	default:
		dualop(p);
		return(2 + adrlen(regs[RT1]) + adrlen(regs[RT2]));
	}
}

adrlen(s)
register char *s;
{
	if (*s == 0)
		return(0);
	if (*s=='r')
		return(0);
	if (*s=='(' && *(s+1)=='r')
		return(0);
	if (*s=='-' && *(s+1)=='(')
		return(0);
	return(2);
}

abs(x)
register int x;
{
	return(x<0? -x: x);
}

equop(ap1, p2)
struct node *ap1, *p2;
{
	register char *cp1, *cp2;
	register struct node *p1;

	p1 = ap1;
	if (p1->op!=p2->op || p1->subop!=p2->subop)
		return(0);
	if (p1->op>0 && p1->op<MOV)
		return(0);
	cp1 = p1->code;
	cp2 = p2->code;
	if (cp1==0 && cp2==0)
		return(1);
	if (cp1==0 || cp2==0)
		return(0);
	while (*cp1 == *cp2++)
		if (*cp1++ == 0)
			return(1);
	return(0);
}

decref(p)
register struct node *p;
{
	if (--p->refc <= 0) {
		nrlab++;
		p->back->forw = p->forw;
		p->forw->back = p->back;
	}
}

struct node *
nonlab(p)
register struct node *p;
{
	CHECK(10);
	while (p && p->op==LABEL)
		p = p->forw;
	return(p);
}

char *
alloc(n)
register n;
{
	register char *p;

#define round(a,b) ((((a)+(b)-1)/(b))*(b))
	n=round(n,sizeof(char *));
	if (alasta+n < alastr) {
		p = alasta;
		alasta += n;
		return(p);
	}
	if (lasta+n >= lastr) {
		if (sbrk(2000) == (char *)-1) {
			fprintf(stderr, "C Optimizer: out of space\n");
			exit(1);
		}
		lastr += 2000;
	}
	p = lasta;
	lasta += n;
	return(p);
}

clearreg()
{
	register int i;

	for (i=0; i<2*NREG; i++)
		regs[i][0] = '\0';
	conloc[0] = 0;
	ccloc[0] = 0;
}

savereg(ai, as)
char *as;
{
	register char *p, *s, *sp;

	sp = p = regs[ai];
	s = as;
	if (source(s))
		return;
	while (*p++ = *s) {
		if (s[0]=='(' && s[1]=='r' && s[2]<'5') {
			*sp = 0;
			return;
		}
		if (*s++ == ',')
			break;
	}
	*--p = '\0';
}

dest(as, flt)
char *as;
{
	register char *s;
	register int i;

	s = as;
	source(s);
	if ((i = isreg(s)) >= 0)
		regs[i+flt][0] = 0;
/* v7orig:
 *	for (i=0; i<NREG+NREG; i++)
 */
	for (i=flt; i<flt+NREG; i++)
		if (*regs[i]=='*' && equstr(s, regs[i]+1))
			regs[i][0] = 0;
	if (equstr(s, conloc))
		conloc[0] = '\0';
	while ((i = findrand(s, flt)) >= 0)
		regs[i][0] = 0;
	while (*s) {
		if ((*s=='(' && (*(s+1)!='r' || *(s+2)!='5')) || *s++=='*') {
/* v7.orig:
 *			for (i=0; i<NREG+NREG; i++) {
 */
			for (i=flt; i<flt+NREG; i++) {
				if (regs[i][0] != '$')
					regs[i][0] = 0;
				conloc[0] = 0;
			}
			return;
		}
	}
}

singop(ap)
struct node *ap;
{
	register char *p1, *p2;

	p1 = ap->code;
	p2 = regs[RT1];
	while (*p2++ = *p1++);
	regs[RT2][0] = 0;
}


dualop(ap)
struct node *ap;
{
	register char *p1, *p2;
	register struct node *p;

	p = ap;
	p1 = p->code;
	p2 = regs[RT1];
	while (*p1 && *p1!=',')
		*p2++ = *p1++;
	*p2++ = 0;
	p2 = regs[RT2];
	*p2 = 0;
	if (*p1++ !=',')
		return;
	while (*p1==' ' || *p1=='\t')
		p1++;
	while (*p2++ = *p1++)
		;
}

findrand(as, flt)
char *as;
{
	register int i;
	for (i = flt; i<NREG+flt; i++) {
		if (equstr(regs[i], as))
			return(i);
	}
	return(-1);
}

isreg(as)
char *as;
{
	register char *s;

	s = as;
	if (s[0]=='r' && s[1]>='0' && s[1]<='4' && s[2]==0)
		return(s[1]-'0');
	return(-1);
}

check()
{
	register struct node *p, *lp;
	register count;

	lp = &first;
	count = 0;
	for (p=first.forw; p!=0; p = p->forw) {
		if (++count > 10000)
			abort(0);
		if (p->back != lp)
			abort(1);
		lp = p;
	}
}

source(ap)
char *ap;
{
	register char *p1, *p2;

	p1 = ap;
	p2 = p1;
	if (*p1==0)
		return(0);
	while (*p2++);
	if (*p1=='-' && *(p1+1)=='('
	 || *p1=='*' && *(p1+1)=='-' && *(p1+2)=='('
	 || *(p2-2)=='+') {
		while (*p1 && *p1++!='r');
		if (*p1>='0' && *p1<='4')
			regs[*p1 - '0'][0] = 0;
		return(1);
	}
	return(0);
}

repladdr(p, f, flt)
struct node *p;
{
	register r;
	int r1;
	register char *p1, *p2;
	static char rt1[50], rt2[50];

	if (f)
		r1 = findrand(regs[RT2], flt);
	else
		r1 = -1;
	r = findrand(regs[RT1], flt);
	if (r1 >= NREG)
		r1 -= NREG;
	if (r >= NREG)
		r -= NREG;
	if (r>=0 || r1>=0) {
		p2 = regs[RT1];
		for (p1 = rt1; *p1++ = *p2++;);
		if (regs[RT2][0]) {
			p1 = rt2;
			*p1++ = ',';
			for (p2 = regs[RT2]; *p1++ = *p2++;);
		} else
			rt2[0] = 0;
		if (r>=0) {
			rt1[0] = 'r';
			rt1[1] = r + '0';
			rt1[2] = 0;
			nsaddr++;
			nchange++;
		}
		if (r1>=0) {
			rt2[1] = 'r';
			rt2[2] = r1 + '0';
			rt2[3] = 0;
			nsaddr++;
			nchange++;
		}
		p->code = copy(2, rt1, rt2);
	}
}

movedat()
{
	register struct node *p1, *p2;
	struct node *p3;
	register seg;
	struct node data;
	struct node *datp;

	if (first.forw == 0)
		return;
	if (lastseg != TEXT && lastseg != -1) {
		p1 = (struct node *)alloc(sizeof(first));
		p1->op = lastseg;
		p1->subop = 0;
		p1->code = NULL;
		p1->forw = first.forw;
		p1->back = &first;
		first.forw->back = p1;
		first.forw = p1;
	}
	datp = &data;
	for (p1 = first.forw; p1!=0; p1 = p1->forw) {
		if (p1->op == DATA) {
			p2 = p1->forw;
			while (p2 && p2->op!=TEXT)
				p2 = p2->forw;
			if (p2==0)
				break;
			p3 = p1->back;
			p1->back->forw = p2->forw;
			p2->forw->back = p3;
			p2->forw = 0;
			datp->forw = p1;
			p1->back = datp;
			p1 = p3;
			datp = p2;
		}
	}
	if (data.forw) {
		datp->forw = first.forw;
		first.forw->back = datp;
		data.forw->back = &first;
		first.forw = data.forw;
	}
	seg = lastseg;
	for (p1 = first.forw; p1!=0; p1 = p1->forw) {
		if (p1->op==TEXT||p1->op==DATA||p1->op==BSS) {
			if (p2 = p1->forw) {
				if (p2->op==TEXT||p2->op==DATA||p2->op==BSS)
					p1->op  = p2->op;
			}
			if (p1->op == seg || p1->forw&&p1->forw->op==seg) {
				p1->back->forw = p1->forw;
				p1->forw->back = p1->back;
				p1 = p1->back;
				continue;
			}
			seg = p1->op;
		}
	}
}

redunbr(p)
register struct node *p;
{
	register struct node *p1;
	register char *ap1;
	char *ap2;

	if ((p1 = p->ref) == 0)
		return;
	p1 = nonlab(p1);
	if (p1->op==TST) {
		singop(p1);
		savereg(RT2, "$0");
	} else if (p1->op==CMP)
		dualop(p1);
	else
		return;
	if (p1->forw->op!=CBR)
		return;
	ap1 = findcon(RT1);
	ap2 = findcon(RT2);
	p1 = p1->forw;
	if (compare(p1->subop, ap1, ap2)>0) {
		nredunj++;
		nchange++;
		decref(p->ref);
		p->ref = p1->ref;
		p->labno = p1->labno;
		p->ref->refc++;
	}
}

char *
findcon(i)
{
	register char *p;
	register r;

	p = regs[i];
	if (*p=='$')
		return(p);
	if ((r = isreg(p)) >= 0)
		return(regs[r]);
	if (equstr(p, conloc))
		return(conval);
	return(p);
}

compare(oper, cp1, cp2)
register char *cp1, *cp2;
{
	register unsigned n1, n2;

	if (*cp1++ != '$' || *cp2++ != '$')
		return(-1);
	n1 = 0;
	while (*cp2 >= '0' && *cp2 <= '7') {
		n1 <<= 3;
		n1 += *cp2++ - '0';
	}
	n2 = n1;
	n1 = 0;
	while (*cp1 >= '0' && *cp1 <= '7') {
		n1 <<= 3;
		n1 += *cp1++ - '0';
	}
	if (*cp1=='+')
		cp1++;
	if (*cp2=='+')
		cp2++;
	do {
		if (*cp1++ != *cp2)
			return(-1);
	} while (*cp2++);
	switch(oper) {

	case JEQ:
		return(n1 == n2);
	case JNE:
		return(n1 != n2);
	case JLE:
		return((int)n1 <= (int)n2);
	case JGE:
		return((int)n1 >= (int)n2);
	case JLT:
		return((int)n1 < (int)n2);
	case JGT:
		return((int)n1 > (int)n2);
	case JLO:
		return(n1 < n2);
	case JHI:
		return(n1 > n2);
	case JLOS:
		return(n1 <= n2);
	case JHIS:
		return(n1 >= n((2);
	}
	return(-1);
}

setcon(ar1, ar2)
char *ar1, *ar2;
{
	register char *cl, *cv, *p;

	cl = ar2;
	cv = ar1;
	if (*cv != '$')
		return;
	if (!natural(cl))
		return;
	p = conloc;
	while (*p++ = *cl++);
	p = conval;
	while (*p++ = *cv++);
}

equstr(ap1, ap2)
char *ap1, *ap2;
{
	register char *p1, *p2;

	p1 = ap1;
	p2 = ap2;
	do {
		if (*p1++ != *p2)
			return(0);
	} while (*p2++);
	return(1);
}

setcc(ap)
char *ap;
{
	register char *p, *p1;

	p = ap;
	if (!natural(p)) {
		ccloc[0] = 0;
		return;
	}
	p1 = ccloc;
	while (*p1++ = *p++);
}

natural(ap)
char *ap;
{
	register char *p;

	p = ap;
	if (*p=='*' || *p=='(' || *p=='-'&&*(p+1)=='(')
		return(0);
	while (*p++);
	p--;
	if (*--p == '+' || *p ==')' && *--p != '5')
		return(0);
	return(1);
}

xnatural(ap)
	char *ap;
{
	if (natural(ap))
		return(1);
	return(equstr("(sp)", ap));
}

not_sp(ap)
	register char *ap;
{
	char c;

	while (c = *ap++)
		if (c == '(') return(*ap == 's' && ap[1] == 'p');
	return(1);
}
lib/cpp/040755 000000 000012 00000000000 07100464737 006067 lib/cpp/README100444 000000 000012 00000015011 03746610547 006751 #
# @(#)README 1.3 3/24/84
#
August 30, 1982
Fixed by Kurt Shoens, UCB
If the "#line n name" occurs, then all future references
to the current file are generated in terms of "name", instead
of the name of file given to cpp in its command argument

August 25, 1978

Files in this directory form the C preprocessor, which handles '#include'
files and macro definition and expansion for the C compiler.
This new version was written by John F. Reiser and is from 5 to 12
times faster (on UNIX systems) than the old.

To create the executable file 'cpp' in the current directory:
	make

To install the preprocessor 'cpp' so it will be used by the C compiler:
	: safety first: backup the existing version
	cp /lib/cpp /lib/ocpp
	: install the new version
	cp cpp /lib/cpp

Invocation
	cpp [-CEPRM] [-Dname] ... [-Dname=def] ... [-Idirectory] ...
		[-Uname] ... [<infile>] [<outfile>]

	If there are two non-flag arguments then the first is the name of the
	input file and the second is the name of the output file.  If there is
	one non-flag argument then it is the name of the input file and the
	output is written on the standard output.  If there are no non-flag
	arguments then the input is taken from the standard input and the output
	is written on the standard output.  Flag arguments are:

		-C	retain comments in output
		-Dname	define name as "1"
		-Dname=def	define name as def
		-E	ignored
		-Idirectory	add directory to search list for #include files
		-M	generate Makefile dependencies (-C and -M ignored)
		-P	don't insert lines "# 12 \"foo.c\"" into output
		-R	allow recursive macros
		-Uname	undefine name
		
Documentation clarifications:
	Symbols defined on the command line by "-Dfoo" are defined as "1",
		i.e., as if they had been defined by "#define foo 1" or "-Dfoo=1".
	The directory search order for #include files is
		1) the directory of the file which contains the #include request
		   (e.g. #include is relative to the file being scanned when
		   the request is made)
		2) the directories specified by -I, in left-to-right order
		3) the standard directory(s) (which for UNIX is /usr/include)
	An unescaped linefeed (the single character "\n") terminates a
		character constant or quoted string.
	An escaped linefeed (the two-character sequence "\\\n") may be
		used in the body of a '#define' statement to continue
		the definition onto the next line.  The escaped linefeed is
		not included in the macro body.
	Comments are uniformly removed (except if the argument -C is specified).
		They are also ignored, except that a comment terminates a token.
		Thus "foo/* la di da */bar" may expand 'foo' and 'bar' but
		will never expand 'foobar'.  If neither 'foo' nor 'bar' is a
		macro then the output is "foobar", even if 'foobar'
		is defined as something else.  The file
			#define foo(a,b)b/**/a
			foo(1,2)
		produces "21" because the comment causes a break which enables
		the recognition of 'b' and 'a' as formals in the string "b/**/a".
	Macro formal parameters are recognized in '#define' bodies even inside
		character constants and quoted strings.  The output from
			#define foo(a) '\a'
			foo(bar)
		is the seven characters " '\\bar'".  Macro names are not recognized
		inside character constants or quoted strings during the regular scan.
		Thus
			#define foo bar
			printf("foo");
		does not expand 'foo' in the second line, because it is inside
		a quoted string which is not part of a '#define' macro definition.
	Macros are not expanded while processing a '#define' or '#undef'.
		Thus
			#define foo bletch
			#define bar foo
			#undef foo
			bar
		produces "foo".  The token appearing immediately after a
		'#ifdef' or '#ifndef' is not expanded (of course!).
	Macros are not expanded during the scan which determines the actual
		parameters to another macro call.  Thus
			#define foo(a,b)b a
			#define bar hi
			foo(bar,
			#define bar bye
			)
		produces " bye" (and warns about the redefinition of 'bar').

There are some differences between the new and the old preprocessor.
Bugs fixed:
	"1.e4" is recognized as a floating-point number, rather than as an
		opportunity to expand the possible macro name "e4".
	Any kind and amount of white space (space, tab, linefeed, vertical tab,
		formfeed, carriage return) is allowed between a macro name and
		the left parenthesis which introduces its actual parameters.
	The comma operator is legal in preprocessor '#if' statements.
	Macros with parameters are legal in preprocessor '#if' statements.
	Single-character character constants are legal in preprocessor '#if' statements.
	Linefeeds are put out in the proper place when a multiline comment
		is not passed through to the output.
	The following example expands to "# # #" :
		#define foo #
		foo foo foo
	If the -R flag is not specified then the invocation of some recursive
		macros is trapped and the recursion forcibly terminated with an
		error message.  The recursions that are trapped are the ones
		in which the nesting level is non-decreasing from some point on.
		In particular,
			#define a a
			a
		will be detected.  (Use "#undef a" if that is what you want.)
		The recursion
			#define a c b
			#define b c a
			#define c foo
			a
		will not be detected because the nesting level decreases after
		each expansion of "c".
	The -R flag specifically allows recursive macros and recursion will
		be strictly obeyed (to the extent that space is available).
		Assuming that -R is specified:
			#define a a
			a
		causes an infinite loop with very little output.  The tail recursion
			#define a <b
			#define b >a
			a
		causes the string "<>" to be output infinitely many times.  The
		non-tail recursion
			#define a b>
			#define b a<
			a
		complains "too much pushback", dumps the pushback, and continues
		(again, infinitely).
	
Stylistic choice:
	Nothing (not even linefeeds) is output while a false '#if', '#ifdef',
		or '#ifndef' is in effect.  Thus when all conditions become true
		a line of the form "# 12345 \"foo.c\"" is output (unless -P).
	Error and warning messages always appear on standard error (file
		descriptor 2).
	Mismatch between the number of formals and actuals in a macro call
		produces only a warning, and not an error.  Excess actuals
		are ignored; missing actuals are turned into null strings.

Incompatibility:
	The virgule '/' in "a=/*b" is interpreted as the first character of
		the pair "/*" which introduces a comment, rather than as the
		second character of the divide-and-replace operator "=/".
		This incompatibility reflects the recent change in the C language
		which made "a/=*b" the legal way to write such a statement
		if the meaning "a=a/ *b" is intended.
lib/cpp/cpp.c100644 000000 000000 00000104374 06171311112 007006 /* static char sccsid[] = "@(#)cpp.c	1.8.2 1996/7/11"; */

#ifdef FLEXNAMES
#define	NCPS	128
#else
#define	NCPS	8
#endif

# include "stdio.h"
# include "ctype.h"
/* C command
/* written by John F. Reiser
/* July/August 1978
*/

#define STATIC

#define STDIN 0
#define STDOUT 1
#define STDERR 2
#define READ 0
#define WRITE 1
#define SALT '#'
#ifndef BUFSIZ
#define BUFSIZ 512
#endif

char *pbeg,*pbuf,*pend;
char *outp,*inp;
char *newp;
char cinit;

/* some code depends on whether characters are sign or zero ex((tended */
/*	#if '\377' < 0		not used here, old cpp doesn't understand */
#if pdp11 | vax | mc68000
#define COFF 128
#else
#define COFF 0
#endif

# if gcos
#define ALFSIZ 512	/* alphabet size */
# else
#define ALFSIZ 256	/* alphabet size */
# endif
char macbit[ALFSIZ+11];
char toktyp[ALFSIZ];
#define BLANK 1
#define IDENT 2
#define NUMBR 3

/* a superimposed code is used to reduce the number of calls to the
/* symbol table lookup routine.  (if the kth character of an identifier
/* is 'a' and there are no macro names whose kth character is 'a'
/* then the identifier cannot be a macro name, hence there is no need
/* to look in the symbol table.)  'scw1' enables the test based on
/* single characters and their position in the identifier.  'scw2'
/* enables the test based on adjacent pairs of characters and their
/* position in the identifier.  scw1 typically costs 1 indexed fetch,
/* an AND, and a jump per character of identifier, until the identifier
/* is known as a non-macro name or until the end of the identifier.
/* scw1 is inexpensive.  scw2 typically costs 4 indexed fetches,
/* an add, an AND, and a jump per character of identifier, but it is also
/* slightly more effective at reducing symbol table searches.
/* scw2 usually costs too much because the symbol table search is
/* usually short; but if symbol table search should become expensive,
/* the code is here.
/* using both scw1 and scw2 is of dubious value.
*/
#define scw1 1
#define scw2 0

#if scw2
char t21[ALFSIZ],t22[ALFSIZ],t23[ALFSIZ+NCPS];
#endif

#if scw1
#define b0 1
#define b1 2
#define b2 4
#define b3 8
#define b4 16
#define b5 32
#define b6 64
#define b7 128
#endif

#define IB 1
#define SB 2
#define NB 4
#define CB 8
#define QB 16
#define WB 32
char fastab[ALFSIZ];
char slotab[ALFSIZ];
char *ptrtab;
#define isslo (ptrtab==(slotab+COFF))
#define isid(a)  ((fastab+COFF)[a]&IB)
#define isspc(a) (ptrtab[a]&SB)
#define isnum(a) ((fastab+COFF)[a]&NB)
#define iscom(a) ((fastab+COFF)[a]&CB)
#define isquo(a) ((fastab+COFF)[a]&QB)
#define iswarn(a) ((fastab+COFF)[a]&WB)

#define eob(a) ((a)>=pend)
#define bob(a) (pbeg>=(a))

# define cputc(a,b)	if(!flslvl) putc(a,b)

char buffer[NCPS+BUFSIZ+BUFSIZ+NCPS];

#ifdef pdp11
# define SBSIZE ((unsigned)0114130)	/* PDP compiler doesn't like 39024 */
short	sbff[SBSIZE/2];
# define sbf ((char *)sbff)
#else !pdp11
# define SBSIZE 60000		/* std = 12000, wnj aug 1979 */
char	sbf[SBSIZE];
#endif pdp11
char	*savch	= sbf;

# define DROP 0xFE	/* special character not legal ASCII or EBCDIC */
# define WARN DROP
# define SAME 0
# define MAXINC 10
# define MAXFRE 14	/* max buffers of macro pushback */
# define MAXFRM 31	/* max number of formals/actuals to a macro */

static char warnc = WARN;

int mactop,fretop;
char *instack[MAXFRE],*bufstack[MAXFRE],*endbuf[MAXFRE];

int plvl;	/* parenthesis level during scan for macro actuals */
int maclin;	/* line number of macro call requiring actuals */
char *macfil;	/* file name of macro call requiring actuals */
char *macnam;	/* name of macro requiring actuals */
int maclvl;	/* # calls since last decrease in nesting level */
char *macforw;	/* pointer which must be exceeded to decrease nesting level */
int macdam;	/* offset to macforw due to buffer shifting */

#if tgp
int tgpscan;	/* flag for dump(); */
#endif

STATIC	int	inctop[MAXINC];
STATIC	char	*fnames[MAXINC];
STATIC	char	*dirnams[MAXINC];	/* actual directory of #include files */
STATIC	int	fins[MAXINC];
STATIC	int	lineno[MAXINC];

STATIC	char	*dirs[10];	/* -I and <> directories */
char *strdex(), *copy(), *subst(), *trmdir();
struct symtab *stsym();
STATIC	int	fin	= STDIN;
STATIC	FILE	*fout	= stdout;
STATIC	int	nd	= 1;
STATIC	int	pflag;	/* don't put out lines "# 12 foo.c" */
int	passcom;	/* don't delete comments */
STATIC	int rflag;	/* allow macro recursion */
STATIC	int mflag;	/* generate makefile dependencies */
STATIC	char *infile;	/* name of .o file to build dependencies from */
STATIC 	FILE *mout;	/* file to place dependencies on */
#define START 1
#define CONT  2
#define BACK  3
STATIC	int	ifno;
# define NPREDEF 30
STATIC	char *prespc[NPREDEF];
STATIC	char **predef = prespc;
STATIC	char *punspc[NPREDEF];
STATIC	char **prund = punspc;
STATIC	int	exfail;
struct symtab {
	char	*name;
	char	*value;
} *lastsym, *lookup(), *slookup();

# if gcos
#include <setjmp.h>
static jmp_buf env;
# define main	mainpp
# undef exit
# define exit(S)	longjmp(env, 1)
# define open(S,D)	fileno(fopen(S, "r"))
# define close(F)	fclose(_f[F])
extern FILE *_f[];
# define symsiz 500
# else
# define symsiz 2000		/* std = 500, wnj aug 1979 */
# endif
STATIC	struct symtab stab[symsiz];

STATIC	struct symtab *defloc;
STATIC	struct symtab *udfloc;
STATIC	struct symtab *incloc;
STATIC	struct symtab *ifloc;
STATIC	struct symtab *elsloc;
STATIC	struct symtab *eifloc;
STATIC	struct symtab *ifdloc;
STATIC	struct symtab *ifnloc;
STATIC	struct symtab *ysysloc;
STATIC	struct symtab *varloc;
STATIC	struct symtab *lneloc;
STATIC	struct symtab *ulnloc;
STATIC	struct symtab *uflloc;
STATIC	int	trulvl;
STATIC	int	flslvl;

sayline(where)
	int where;
{
	if (mflag && where==START) fprintf(mout, "%s: %s\n", infile, fnames[ifno]);
	if (pflag==0) fprintf(fout,"# %d \"%s\"\n", lineno[ifno], fnames[ifno]);
}

/* data structure guide
/*
/* most of the scanning takes place in the buffer:
/*
/*  (low address)                                             (high address)
/*  pbeg                           pbuf                                 pend
/*  |      <-- BUFSIZ chars -->      |         <-- BUFSIZ chars -->        |
/*  _______________________________________________________________________
/* |_______________________________________________________________________|
/*          |               |               |
/*          |<-- waiting -->|               |<-- waiting -->
/*          |    to be      |<-- current -->|    to be
/*          |    written    |    token      |    scanned
/*          |               |               |
/*          outp            inp             p
/*
/*  *outp   first char not yet written to output file
/*  *inp    first char of current token
/*  *p      first char not yet scanned
/*
/* macro expansion: write from *outp to *inp (chars waiting to be written),
/* ignore from *inp to *p (chars of the macro call), place generated
/* characters in front of *p (in reverse order), update pointers,
/* resume scanning.
/*
/* symbol table pointers point to just beyond the end of macro definitions;
/* the first preceding character is the number of formal parameters.
/* the appearance of a formal in the body of a definition is marked by
/* 2 chars: the char WARN, and a char containing the parameter number.
/* the first char of a definition is preceded by a zero character.
/*
/* when macro expansion attempts to back up over the beginning of the
/* buffer, some characters preceding *pend are saved in a side buffer,
/* the address of the side buffer is put on 'instack', and the rest
/* of the main buffer is moved to the right.  the end of the saved buffer
/* is kept in 'endbuf' since there may be nulls in the saved buffer.
/*
/* similar action is taken when an 'include' statement is processed,
/* except that the main buffer must be completely emptied.  the array
/* element 'inctop[ifno]' records the last side buffer saved when
/* file 'ifno' was included.  these buffers remain dormant while
/* the file is being read, and are reactivated at end-of-file.
/*
/* instack[0 : mactop] holds the addresses of all pending side buffers.
/* instack[inctop[ifno]+1 : mactop-1] holds the addresses of the side
/* buffers which are "live"; the side buffers instack[0 : inctop[ifno]]
/* are dormant, waiting for end-of-file on the current file.
/*
/* space for side buffers is obtained from 'savch' and is never returned.
/* bufstack[0:fretop-1] holds addresses of side buffers which
/* are available for use.
*/

dump() {
/* write part of buffer which lies between  outp  and  inp .
/* this should be a direct call to 'write', but the system slows to a crawl
/* if it has to do an unaligned copy.  thus we buffer.  this silly loop
/* is 15% of the total time, thus even the 'putc' macro is too slow.
*/
	register char *p1,*p2; register FILE *f;
	if ((p1=outp)==inp || flslvl!=0) return;
#if tgp
#define MAXOUT 80
	if (!tgpscan) {/* scan again to insure <= MAXOUT chars between linefeeds */
		register char c,*pblank; char savc,stopc,brk;
		tgpscan=1; brk=stopc=pblank=0; p2=inp; savc= *p2; *p2='\0';
		while (c= *p1++) {
			if (c=='\\') c= *p1++;
			if (stopc==c) stopc=0;
			else if (c=='"' || c=='\'') stopc=c;
			if (p1-outp>MAXOUT && pblank!=0) {
				*pblank++='\n'; inp=pblank; dump(); brk=1; pblank=0;
			}
			if (c==' ' && stopc==0) pblank=p1-1;
		}
		if (brk) sayline(CONT);
		*p2=savc; inp=p2; p1=outp; tgpscan=0;
	}
#endif
	f=fout;
# if gcos
/* filter out "$ program c" card if first line of input */
/* gmatch is a simple pattern matcher in the GCOS Standard Library */
{	static int gmfirst = 0;
	if (!gmfirst) {
		++gmfirst;
		if (gmatch(p1, "^$*program[ \t]*c*"))
			p1 = strdex(p1, '\n');
	}
}
# endif
	while (p1<inp) putc(*p1++,f);
	outp=p1;
}

char *
refill(p) register char *p; {
/* dump buffer.  save chars from inp to p.  read into buffer at pbuf,
/* contiguous with p.  update pointers, return new p.
*/
	register char *np,*op; register int ninbuf;
	dump(); np=pbuf-(p-inp); op=inp;
	if (bob(np+1)) {pperror("token too long"); np=pbeg; p=inp+BUFSIZ;}
	macdam += np-inp; outp=inp=np;
	while (op<p) *np++= *op++;
	p=np;
	for (;;) {
		if (mactop>inctop[ifno]) {/* retrieve hunk of pushed-back macro text */
			op=instack[--mactop]; np=pbuf;
			do {while (*np++= *op++);} while (op<endbuf[mactop]); pend=np-1;
			/* make buffer space avail for 'include' processing */
			if (fretop<MAXFRE) bufstack[fretop++]=instack[mactop];
			return(p);
		} else {/* get more text from file(s) */
			maclvl=0;
			if (0<(ninbuf=read(fin,pbuf,BUFSIZ))) {
				pend=pbuf+ninbuf; *pend='\0';
				return(p);
			}
			/* end of #include file */
			if (ifno==0) {/* end of input */
				if (plvl!=0) {
					int n=plvl,tlin=lineno[ifno]; char *tfil=fnames[ifno];
					lineno[ifno]=maclin; fnames[ifno]=macfil;
					pperror("%s: unterminated macro call",macnam);
					lineno[if((no]=tlin; fnames[ifno]=tfil;
					np=p; *np++='\n';	/* shut off unterminated quoted string */
					while (--n>=0) *np++=')';	/* supply missing parens */
					pend=np; *np='\0'; if (plvl<0) plvl=0;
					return(p);
				}
				if (trulvl || flslvl)
					pperror("missing endif");
				inp=p; dump(); exit(exfail);
			}
			close(fin); fin=fins[--ifno]; dirs[0]=dirnams[ifno]; sayline(BACK);
		}
	}
}

#define BEG 0
#define LF 1

char *
cotoken(p) register char *p; {
	register int c,i; char quoc;
	static int state = BEG;

	if (state!=BEG) goto prevlf;
for (;;) {
again:
	while (!isspc(*p++));
	switch (*(inp=p-1)) {
	case 0: {
		if (eob(--p)) {p=refill(p); goto again;}
		else ++p; /* ignore null byte */
	} break;
	case '|': case '&': for (;;) {/* sloscan only */
		if (*p++== *inp) break;
		if (eob(--p)) p=refill(p);
		else break;
	} break;
	case '=': case '!': for (;;) {/* sloscan only */
		if (*p++=='=') break;
		if (eob(--p)) p=refill(p);
		else break;
	} break;
	case '<': case '>': for (;;) {/* sloscan only */
		if (*p++=='=' || p[-2]==p[-1]) break;
		if (eob(--p)) p=refill(p);
		else break;
	} break;
	case '\\': for (;;) {
		if (*p++=='\n') {++lineno[ifno]; break;}
		if (eob(--p)) p=refill(p);
		else {++p; break;}
	} break;
	case '/': for (;;) {
		if (*p++=='*') {/* comment */
			if (!passcom) {inp=p-2; dump(); ++flslvl;}
			for (;;) {
				while (!iscom(*p++));
				if (p[-1]=='*') for (;;) {
					if (*p++=='/') goto endcom;
					if (eob(--p)) {
						if (!passcom) {inp=p; p=refill(p);}
						else if ((p-inp)>=BUFSIZ) {/* split long comment */
							inp=p; p=refill(p);	/* last char written is '*' */
							cputc('/',fout);	/* terminate first part */
							/* and fake start of 2nd */
							outp=inp=p-=3; *p++='/'; *p++='*'; *p++='*';
						} else p=refill(p);
					} else break;
				} else if (p[-1]=='\n') {
					++lineno[ifno]; if (!passcom) putc('\n',fout);
				} else if (eob(--p)) {
					if (!passcom) {inp=p; p=refill(p);}
					else if ((p-inp)>=BUFSIZ) {/* split long comment */
						inp=p; p=refill(p);
						cputc('*',fout); cputc('/',fout);
						outp=inp=p-=2; *p++='/'; *p++='*';
					} else p=refill(p);
				} else ++p; /* ignore null byte */
			}
		endcom:
			if (!passcom) {outp=inp=p; --flslvl; goto again;}
			break;
		}
		if (eob(--p)) p=refill(p);
		else break;
	} break;
# if gcos
	case '`':
# endif
	case '"': case '\'': {
		quoc=p[-1];
		for (;;) {
			while (!isquo(*p++));
			if (p[-1]==quoc) break;
			if (p[-1]=='\n') {--p; break;} /* bare \n terminates quotation */
			if (p[-1]=='\\') for (;;) {
				if (*p++=='\n') {++lineno[ifno]; break;} /* escaped \n ignored */
				if (eob(--p)) p=refill(p);
				else {++p; break;}
			} else if (eob(--p)) p=refill(p);
			else ++p;	/* it was a different quote character */
		}
	} break;
	case '\n': {
		++lineno[ifno]; if (isslo) {state=LF; return(p);}
prevlf:
		state=BEG;
		for (;;) {
			if (*p++=='#') return(p);
			if (eob(inp= --p)) p=refill(p);
			else goto again;
		}
	} break;
	case '0': case '1': case '2': case '3': case '4':
	case '5': case '6': case '7': case '8': case '9':
	for (;;) {
		while (isnum(*p++));
		if (eob(--p)) p=refill(p);
		else break;
	} break;
	case 'A': case 'B': case 'C': case 'D': case 'E':
	case 'F': case 'G': case 'H': case 'I': case 'J':
	case 'K': case 'L': case 'M': case 'N': case 'O':
	case 'P': case 'Q': case 'R': case 'S': case 'T':
	case 'U': case 'V': case 'W': case 'X': case 'Y':
	case 'Z': case '_':
	case 'a': case 'b': case 'c': case 'd': case 'e':
	case 'f': case 'g': case 'h': case 'i': case 'j':
	case 'k': case 'l': case 'm': case 'n': case 'o':
	case 'p': case 'q': case 'r': case 's': case 't':
	case 'u': case 'v': case 'w': case 'x': case 'y':
	case 'z':
#if scw1
#define tmac1(c,bit) if (!xmac1(c,bit,&)) goto nomac
#define xmac1(c,bit,op) ((macbit+COFF)[c] op (bit))
#else
#define tmac1(c,bit)
#define xmac1(c,bit,op)
#endif

#if scw2
#define tmac2(c0,c1,cpos) if (!xmac2(c0,c1,cpos,&)) goto nomac
#define xmac2(c0,c1,cpos,op)\
	((macbit+COFF)[(t21+COFF)[c0]+(t22+COFF)[c1]] op (t23+COFF+cpos)[c0])
#else
#define tmac2(c0,c1,cpos)
#define xmac2(c0,c1,cpos,op)
#endif

	if (flslvl) goto nomac;
	for (;;) {
		c= p[-1];                          tmac1(c,b0);
		i= *p++; if (!isid(i)) goto endid; tmac1(i,b1); tmac2(c,i,0);
		c= *p++; if (!isid(c)) goto endid; tmac1(c,b2); tmac2(i,c,1);
		i= *p++; if (!isid(i)) goto endid; tmac1(i,b3); tmac2(c,i,2);
		c= *p++; if (!isid(c)) goto endid; tmac1(c,b4); tmac2(i,c,3);
		i= *p++; if (!isid(i)) goto endid; tmac1(i,b5); tmac2(c,i,4);
		c= *p++; if (!isid(c)) goto endid; tmac1(c,b6); tmac2(i,c,5);
		i= *p++; if (!isid(i)) goto endid; tmac1(i,b7); tmac2(c,i,6);
		                                                tmac2(i,0,7);
		while (isid(*p++));
		if (eob(--p)) {refill(p); p=inp+1; continue;}
		goto lokid;
	endid:
		if (eob(--p)) {refill(p); p=inp+1; continue;}
		tmac2(p[-1],0,-1+(p-inp));
	lokid:
		slookup(inp,p,0); if (newp) {p=newp; goto again;}
		else break;
	nomac:
		while (isid(*p++));
		if (eob(--p)) {p=refill(p); goto nomac;}
		else break;
	} break;
	} /* end of switch */
	
	if (isslo) return(p);
} /* end of infinite loop */
}

char *
skipbl(p) register char *p; {/* get next non-blank token */
	do {outp=inp=p; p=cotoken(p);} while ((toktyp+COFF)[*inp]==BLANK);
	return(p);
}

char *
unfill(p) register char *p; {
/* take <= BUFSIZ chars from right end of buffer and put them on instack .
/* slide rest of buffer to the right, update pointers, return new p.
*/
	register char *np,*op; register int d;
	if (mactop>=MAXFRE) {
		pperror("%s: too much pushback",macnam);
		p=inp=pend; dump();	/* begin flushing pushback */
		while (mactop>inctop[ifno]) {p=refill(p); p=inp=pend; dump();}
	}
	if (fretop>0) np=bufstack[--fretop];
	else {
		np=savch; savch+=BUFSIZ;
		if (savch>=sbf+SBSIZE) {pperror("no space"); exit(exfail);}
		*savch++='\0';
	}
	instack[mactop]=np; op=pend-BUFSIZ; if (op<p) op=p;
	for (;;) {while (*np++= *op++); if (eob(op)) break;} /* out with old */
	endbuf[mactop++]=np;	/* mark end of saved text */
	np=pbuf+BUFSIZ; op=pend-BUFSIZ; pend=np; if (op<p) op=p;
	while (outp<op) *--np= *--op; /* slide over new */
	if (bob(np)) pperror("token too long");
	d=np-outp; outp+=d; inp+=d; macdam+=d; return(p+d);
}

char *
doincl(p) register char *p; {
	int filok,inctype;
	register char *cp; char **dirp,*nfil; char filname[BUFSIZ];

	p=skipbl(p); cp=filname;
	if (*inp++=='<') {/* special <> syntax */
		inctype=1;
		++flslvl;	/* prevent macro expansion */
		for (;;) {
			outp=inp=p; p=cotoken(p);
			if (*inp=='\n') {--p; *cp='\0'; break;}
			if (*inp=='>') {      *cp='\0'; break;}
# ifdef gimpel
			if (*inp=='.' && !intss()) *inp='#';
# endif
			while (inp<p) *cp++= *inp++;
		}
		--flslvl;	/* reenable macro expansion */
	} else if (inp[-1]=='"') {/* regular "" syntax */
		inctype=0;
# ifdef gimpel
		while (inp<p) {if (*inp=='.' && !intss()) *inp='#'; *cp++= *inp++;}
# else
		while (inp<p) *cp++= *inp++;
# endif
		if (*--cp=='"') *cp='\0';
	} else {pperror("bad include syntax",0); inctype=2;}
	/* flush current file to \n , then write \n */
	++flslvl; do {outp=inp=p; p=cotoken(p);} while (*inp!='\n'); --flslvl;
	inp=p; dump(); if (inctype==2) return(p);
	/* look for included file */
	if (ifno+1 >=MAXINC) {
		pperror("Unreasonable include nesting",0); return(p);
	}
	if((nfil=savch)>sbf+SBSIZE-BUFSIZ) {pperror("no space"); exit(exfail);}
	filok=0;
	for (dirp=dirs+inctype; *dirp; ++dirp) {
		if (
# if gcos
			strdex(filname, '/')
# else
			filname[0]=='/' 
# endif
				|| **dirp=='\0') strcpy(nfil,filname);
		else {
			strcpy(nfil,*dirp);
# if unix || gcos
			strcat(nfil,"/");
# endif
#ifdef ibm
#ifndef gimpel
			strcat(nfil,".");
#endif
#endif
			strcat(nfil,filname);
		}
		if (0<(fins[ifno+1]=open(nfil,READ))) {
			filok=1; fin=fins[++ifno]; break;
		}
	}
	if (filok==0) pperror("Can't find include file %s",filname);
	else {
		lineno[ifno]=1; fnames[ifno]=cp=nfil; while (*cp++); savch=cp;
		dirnams[ifno]=dirs[0]=trmdir(copy(nfil));
		sayline(START);
		/* save current contents of buffer */
		while (!eob(p)) p=unfill(p);
		inctop[ifno]=mactop;
	}
	return(p);
}

equfrm(a,p1,p2) register char *a,*p1,*p2; {
	register char c; int flag;
	c= *p2; *p2='\0';
	flag=strcmp(a,p1); *p2=c; return(flag==SAME);
}

char *
dodef(p) char *p; {/* process '#define' */
	register char *pin,*psav,*cf;
	char **pf,**qf; int b,c,params; struct symtab *np;
	char *oldval,*oldsavch;
	char *formal[MAXFRM]; /* formal[n] is name of nth formal */
	char formtxt[BUFSIZ]; /* space for formal names */
	int spasscom = passcom;
	passcom = 0;		/* strip comments from defines to save space */

	if (savch>sbf+SBSIZE-BUFSIZ) {pperror("too much defining"); return(p);}
	oldsavch=savch; /* to reclaim space if redefinition */
	++flslvl; /* prevent macro expansion during 'define' */
	p=skipbl(p); pin=inp;
	if ((toktyp+COFF)[*pin]!=IDENT) {
		ppwarn("illegal macro name"); while (*inp!='\n') p=skipbl(p); return(p);
	}
	np=slookup(pin,p,1);
	if (oldval=np->value) savch=oldsavch;	/* was previously defined */
	b=1; cf=pin;
	while (cf<p) {/* update macbit */
		c= *cf++; xmac1(c,b,|=); b=(b+b)&0xFF;
		if (cf!=p) xmac2(c,*cf,-1+(cf-pin),|=);
		else xmac2(c,0,-1+(cf-pin),|=);
	}
	params=0; outp=inp=p; p=cotoken(p); pin=inp;
	if (*pin=='(') {/* with parameters; identify the formals */
		cf=formtxt; pf=formal;
		for (;;) {
			p=skipbl(p); pin=inp;
			if (*pin=='\n') {
				--lineno[ifno]; --p; pperror("%s: missing )",np->name); break;
			}
			if (*pin==')') break;
			if (*pin==',') continue;
			if ((toktyp+COFF)[*pin]!=IDENT) {
				c= *p; *p='\0'; pperror("bad formal: %s",pin); *p=c;
			} else if (pf>= &formal[MAXFRM]) {
				c= *p; *p='\0'; pperror("too many formals: %s",pin); *p=c;
			} else {
				*pf++=cf; while (pin<p) *cf++= *pin++; *cf++='\0'; ++params;
			}
		}
		if (params==0) --params; /* #define foo() ... */
	} else if (*pin=='\n') {--lineno[ifno]; --p;}
	/* remember beginning of macro body, so that we can
	/* warn if a redefinition is different from old value.
	*/
	oldsavch=psav=savch;
	for (;;) {/* accumulate definition until linefeed */
		outp=inp=p; p=cotoken(p); pin=inp;
		if (*pin=='\\' && pin[1]=='\n') {putc('\n',fout); continue;}	/* ignore escaped lf */
		if (*pin=='\n') break;
		if (params)(( {/* mark the appearance of formals in the definiton */
			if ((toktyp+COFF)[*pin]==IDENT) {
				for (qf=pf; --qf>=formal; ) {
					if (equfrm(*qf,pin,p)) {
						*psav++=qf-formal+1; *psav++=WARN; pin=p; break;
					}
				}
			} else if (*pin=='"' || *pin=='\''
# if gcos
					|| *pin=='`'
# endif
						) {/* inside quotation marks, too */
				char quoc= *pin;
				for (*psav++= *pin++; pin<p && *pin!=quoc; ) {
					while (pin<p && !isid(*pin)) *psav++= *pin++;
					cf=pin; while (cf<p && isid(*cf)) ++cf;
					for (qf=pf; --qf>=formal; ) {
						if (equfrm(*qf,pin,cf)) {
							*psav++=qf-formal+1; *psav++=WARN; pin=cf; break;
						}
					}
					while (pin<cf) *psav++= *pin++;
				}
			}
		}
		while (pin<p) *psav++= *pin++;
	}
	*psav++=params; *psav++='\0';
	if ((cf=oldval)!=NULL) {/* redefinition */
		--cf;	/* skip no. of params, which may be zero */
		while (*--cf);	/* go back to the beginning */
		if (0!=strcmp(++cf,oldsavch)) {/* redefinition different from old */
			--lineno[ifno]; ppwarn("%s redefined",np->name); ++lineno[ifno];
			np->value=psav-1;
		} else psav=oldsavch; /* identical redef.; reclaim space */
	} else np->value=psav-1;
	--flslvl; inp=pin; savch=psav; passcom = spasscom; return(p);
}

#define fasscan() ptrtab=fastab+COFF
#define sloscan() ptrtab=slotab+COFF

char *
control(p) register char *p; {/* find and handle preprocessor control lines */
	register struct symtab *np;
for (;;) {
	fasscan(); p=cotoken(p); if (*inp=='\n') ++inp; dump();
	sloscan(); p=skipbl(p);
	*--inp=SALT; outp=inp; ++flslvl; np=slookup(inp,p,0); --flslvl;
	if (np==defloc) {/* define */
		if (flslvl==0) {p=dodef(p); continue;}
	} else if (np==incloc) {/* include */
		if (flslvl==0) {p=doincl(p); continue;}
	} else if (np==ifnloc) {/* ifndef */
		++flslvl; p=skipbl(p); np=slookup(inp,p,0); --flslvl;
		if (flslvl==0 && np->value==0) ++trulvl;
		else ++flslvl;
	} else if (np==ifdloc) {/* ifdef */
		++flslvl; p=skipbl(p); np=slookup(inp,p,0); --flslvl;
		if (flslvl==0 && np->value!=0) ++trulvl;
		else ++flslvl;
	} else if (np==eifloc) {/* endif */
		if (flslvl) {if (--flslvl==0) sayline(CONT);}
		else if (trulvl) --trulvl;
		else pperror("If-less endif",0);
	} else if (np==elsloc) {/* else */
		if (flslvl) {
			if (--flslvl!=0) ++flslvl;
			else {++trulvl; sayline(CONT);}
		}
		else if (trulvl) {++flslvl; --trulvl;}
		else pperror("If-less else",0);
	} else if (np==udfloc) {/* undefine */
		if (flslvl==0) {
			++flslvl; p=skipbl(p); slookup(inp,p,DROP); --flslvl;
		}
	} else if (np==ifloc) {/* if */
#if tgp
		pperror(" IF not implemented, true assumed", 0);
		if (flslvl==0) ++trulvl; else ++flslvl;
#else
		newp=p;
		if (flslvl==0 && yyparse()) ++trulvl; else ++flslvl;
		p=newp;
#endif
	} else if (np==lneloc) {/* line */
		if (flslvl==0 && pflag==0) {
			char *cp, *cp2, *savestring();
			outp=inp=p; *--outp='#'; while (*inp!='\n') p=cotoken(p);
			cp = outp + 1;
			while (isspace(*cp) && cp < inp)
				cp++;
			while (isdigit(*cp) && cp < inp)
				cp++;
			while (*cp != '"' && cp < inp)
				cp++;
			if (cp < inp) {
				cp++;
				cp2 = cp;
				while (*cp2 != '"' && cp2 < inp)
					cp2++;
				fnames[ifno] = savestring(cp, cp2);
			}
			continue;
		}
	} else if (*++inp=='\n') outp=inp;	/* allows blank line after # */
	else pperror("undefined control",0);
	/* flush to lf */
	++flslvl; while (*inp!='\n') {outp=inp=p; p=cotoken(p);} --flslvl;
}
}

char *
savestring(start, finish)
	register char *start, *finish;
{
	char *retbuf;
	register char *cp;

	retbuf = (char *) calloc(finish - start + 1, sizeof (char));
	cp = retbuf;
	while (start < finish)
		*cp++ = *start++;
	*cp = 0;
	return(retbuf);
}

struct symtab *
stsym(s) register char *s; {
	char buf[BUFSIZ]; register char *p;

	/* make definition look exactly like end of #define line */
	/* copy to avoid running off end of world when param list is at end */
	p=buf; while (*p++= *s++);
	p=buf; while (isid(*p++)); /* skip first identifier */
	if (*--p=='=') {*p++=' '; while (*p++);}
	else {s=" 1"; while (*p++= *s++);}
	pend=p; *--p='\n';
	sloscan(); dodef(buf); return(lastsym);
}

struct symtab *
ppsym(s) char *s; {/* kluge */
	register struct symtab *sp;
	cinit=SALT; *savch++=SALT; sp=stsym(s); --sp->name; cinit=0; return(sp);
}

/* VARARGS1 */
pperror(s,x,y) char *s; {
	if (fnames[ifno][0]) fprintf(stderr,
# if gcos
			"*%c*   \"%s\", line ", exfail >= 0 ? 'F' : 'W',
# else
			"%s: ",
# endif
				 fnames[ifno]);
	fprintf(stderr, "%d: ",lineno[ifno]);
	fprintf(stderr, s, x, y);
	fprintf(stderr,"\n");
	++exfail;
}

yyerror(s,a,b) char *s; {
	pperror(s,a,b);
}

ppwarn(s,x) char *s; {
	int fail = exfail;
	exfail = -1;
	pperror(s,x);
	exfail = fail;
}

struct symtab *
lookup(namep, enterf)
char *namep;
{
	register char *np, *snp;
	register int c, i; int around;
	register struct symtab *sp;

	/* namep had better not be too long (currently, <=NCPS chars) */
	np=namep; around=0; i=cinit;
	while (c= *np++) i += i+c; c=i;	/* c=i for register usage on pdp11 */
	c %= symsiz; if (c<0) c += symsiz;
	sp = &stab[c];
	while (snp=sp->name) {
		np = namep;
		while (*snp++ == *np) if (*np++ == '\0') {
				if (enterf==DROP) {sp->name[0]= DROP; sp->value=0;}
				return(lastsym=sp);
			}
		if (--sp < &stab[0])
			if (around) {pperror("too many defines", 0); exit(exfail);}
			else {++around; sp = &stab[symsiz-1];}
	}
	if (enterf==1) sp->name=namep;
	return(lastsym=sp);
}

struct symtab *
slookup(p1,p2,enterf) register char *p1,*p2; int enterf;{
	register char *p3; char c2,c3; struct symtab *np;
	         c2= *p2; *p2='\0';	/* mark end of token */
	if ((p2-p1)>NCPS) p3=p1+NCPS; else p3=p2;
			 c3= *p3; *p3='\0';	/* truncate to NCPS chars or less */
	if (enterf==1) p1=copy(p1);
	np=lookup(p1,enterf); *p3=c3; *p2=c2;
	if (np->value!=0 && flslvl==0) newp=subst(p2,np);
	else newp=0;
	return(np);
}

char *
subst(p,sp) register char *p; struct symtab *sp; {
	static char match[]="%s: argument mismatch";
	register char *ca,*vp; int params;
	char *actual[MAXFRM]; /* actual[n] is text of nth actual   */
	char actused[MAXFRM]; /* for newline processing in actuals */
	char acttxt[BUFSIZ];  /* space for actuals */
	int  nlines = 0;

	if (0==(vp=sp->value)) return(p);
	if ((p-macforw)<=macdam) {
		if (++maclvl>symsiz && !rflag) {
			pperror("%s: macro recursion",sp->name); return(p);
		}
	} else maclvl=0;	/* level decreased */
	macforw=p; macdam=0;	/* new target for decrease in level */
	macnam=sp->name;
	dump();
	if (sp==ulnloc) {
		vp=acttxt; *vp++='\0';
		sprintf(vp,"%d",lineno[ifno]); while (*vp++);
	} else if (sp==uflloc) {
		vp=acttxt; *vp++='\0';
		sprintf(vp,"\"%s\"",fnames[ifno]); while (*vp++);
	}
	if (0!=(params= *--vp&0xFF)) {/* definition calls for params */
		register char **pa;
		ca=acttxt; pa=actual;
		if (params==0xFF) params=1;	/* #define foo() ... */
		sloscan(); ++flslvl; /* no expansion during search for actuals */
		plvl= -1;
		do p=skipbl(p); while (*inp=='\n');	/* skip \n too */
		if (*inp=='(') {
			maclin=lineno[ifno]; macfil=fnames[ifno];
			for (plvl=1; plvl!=0; ) {
				*ca++='\0';
				for (;;) {
					outp=inp=p; p=cotoken(p);
					if (*inp=='(') ++plvl;
					if (*inp==')' && --plvl==0) {--params; break;}
					if (plvl==1 && *inp==',') {--params; break;}
					while (inp<p) *ca++= *inp++;
					if (ca> &acttxt[BUFSIZ])
						pperror("%s: actuals too long",sp->name);
				}
				if (pa>= &actual[MAXFRM]) ppwarn(match,sp->name);
				else { actused[pa-actual]=0; *pa++=ca; }
			}
			nlines = lineno[ifno] - maclin;
			lineno[ifno] = maclin; /* don't count newlines here */
		}
		if (params!=0) ppwarn(match,sp->name);
		while (--params>=0) *pa++=""+1;	/* null string for missing actuals */
		--flslvl; fasscan();
	}
	for (;;) {/* push definition onto front of input stack */
		while (!iswarn(*--vp)) {
			if (bob(p)) {outp=inp=p; p=unfill(p);}
			*--p= *vp;
		}
		if (*vp==warnc) {/* insert actual param */
			ca=actual[*--vp-1];
			while (*--ca) {
				if (bob(p)) {outp=inp=p; p=unfill(p);}
				/* Actuals with newlines confuse line numbering */
				if (*ca == '\n' && actused[*vp-1])
					if (*(ca-1) == '\\') ca--;
					else *--p = ' ';
				else { *--p= *ca; if (*ca == '\n') nlines--; }
			}
			actused[*vp-1] = 1;
		} else {
			if (nlines > 0 )
				while (nlines-- > 0)
					*--p = '\n';
			break;
		}
	}
	outp=inp=p;
	return(p);
}




char *
trmdir(s) register char *s; {
	register char *p = s;
	while (*p++); --p; while (p>s && *--p!='/');
# if unix
	if (p==s) *p++='.';
# endif
	*p='\0';
	return(s);
}

STATIC char *
copy(s) register char *s; {
	register char *old;

	old = savch; while (*savch++ = *s++);
	return(old);
}

char *
strdex(s,c) char *s,c; {
	while (*s) if (*s++==c) return(--s);
	return(0);
}

yywrap(){ return(1); }

main(argc,argv)
	char *argv[];
{
	register int i,c;
	register char *p;
	char *tf,**cp2, obuf[BUFSIZ];

# if gcos
	if (setjmp(env)) return (exfail);
# endif
	p="_$ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		i=0;
		while (c= *p++) {
			(fastab+COFF)[c] |= IB|NB|SB; (toktyp+COFF)[c]=IDENT;
#if scw2
			/* 53 == 63-10; digits rarely appear in identifiers,
			/* and can never be the first char of an identifier.
			/* 11 == 53*53/sizeof(macbit) .
			*/
			++i; (t21+COFF)[c]=(53*i)/11; (t22+COFF)[c]=i%11;
#endif
		}
	p="0123456789.";
		while (c= *p++) {(fastab+COFF)[c] |= NB|SB; (toktyp+COFF)[c]=NUMBR;}
# if gcos
	p="\n\"'`/\\";
# else
	p="\n\"'/\\";
# endif
		while (c= *p++) (fastab+COFF)[c] |= SB;
# if gcos
	p="\n\"'`\\";
# else
	p="\n\"'\\";
# endif
		while (c= *p++) (fastab+COFF)[c] |= QB;
	p="*\n"; while (c= *p++) (fastab+COFF)[c] |= CB;
	(fastab+COFF)[warnc] |= WB;
	(fastab+COFF)['\0'] |= CB|QB|SB|WB;
	for (i=ALFSIZ; --i>=0; ) slotab[i]=fastab[i]|SB;
	p=" \t\013\f\r";	/* note no \n;	\v not legal for vertical tab? */
		while (c= *p++) (toktyp+COFF)[c]=BLANK;
#if scw2
	for ((t23+COFF)[i=ALFSIZ+7-COFF]=1; --i>=-COFF; )
		if (((t23+COFF)[i]=(t23+COFF+1)[i]<<1)==0) (t23+COFF)[i]=1;
#endif

# if unix
	fnames[ifno=0] = ""; dirnams[0]=dirs[0]=".";
# endif
# if ibm
	fnames[ifno=0] = "";
# endif
# if gcos
	if (inquire(stdin, _TTY)) freopen("*src", "rt", stdin);
# endif
# if gimpel || gcos
	fnames[ifno=0] = (char *)inquire(stdin, _FILENAME);
	dirnams[0] = dirs[0] = trmdir(copy(fnames[0]));
# endif
	for(i=1; i<arg((c; i++)
		{
		switch(argv[i][0])
			{
			case '-':
# if gcos
			switch(toupper(argv[i][1])) { /* case-independent on GCOS */
# else
			switch(argv[i][1]) {
# endif
				case 'M': mflag++;
				case 'P': pflag++;
				case 'E': continue;
				case 'R': ++rflag; continue;
				case 'C': passcom++; continue;
				case 'D':
					if (predef>prespc+NPREDEF) {
						pperror("too many -D options, ignoring %s",argv[i]);
						continue;
					}
					/* ignore plain "-D" (no argument) */
					if (*(argv[i]+2)) *predef++ = argv[i]+2;
					continue;
				case 'U':
					if (prund>punspc+NPREDEF) {
						pperror("too many -U options, ignoring %s",argv[i]);
						continue;
					}
					*prund++ = argv[i]+2;
					continue;
				case 'I':
					if (nd>8) pperror("excessive -I file (%s) ignored",argv[i]);
					else dirs[nd++] = argv[i]+2;
					continue;
				case '\0': continue;
				default: 
					pperror("unknown flag %s", argv[i]);
					continue;
				}
			default:
				if (fin==STDIN) {
					if (0>(fin=open(argv[i], READ))) {
						pperror("No source file %s",argv[i]); exit(8);
					}
					fnames[ifno]=copy(argv[i]);
					infile=copy(argv[i]);
					dirs[0]=dirnams[ifno]=trmdir(argv[i]);
# ifndef gcos
/* too dangerous to have file name in same syntactic position
   be input or output file depending on file redirections,
   so force output to stdout, willy-nilly
	[i don't see what the problem is.  jfr]
*/
				} else if (fout==stdout) {
					if (NULL==(fout=fopen(argv[i], "w"))) {
						pperror("Can't create %s", argv[i]); exit(8);
					} else fclose(stdout);
# endif
				} else pperror("extraneous name %s", argv[i]);
			}
		}

	if (mflag) {
		if (infile==(char *)0) {
			fprintf(stderr,
				"no input file specified with -M flag\n");
			exit(8);
		}
		tf=(char *)rindex(infile, '.');
		if (tf==0) {
			fprintf(stderr, "missing component name on %s\n",
				infile);
			exit(8);
		}
		tf[1]='o';
		tf=(char *)rindex(infile, '/');
		if (tf!=(char *)0)
			infile = tf + 1;
		mout=fout;
		setbuf(mout, (char *)NULL);
		if (NULL==(fout=fopen("/dev/null", "w"))) {
			pperror("Can't open /dev/null");
			exit(8);
		}
	}
	setbuf(fout, obuf);
	fins[ifno]=fin;
	exfail = 0;
		/* after user -I files here are the standard include libraries */
# if unix
	dirs[nd++] = "/usr/include";
# endif
# if gcos
	dirs[nd++] = "cc/include";
# endif
# if ibm
# ifndef gimpel
	dirs[nd++] = "BTL$CLIB";
# endif
# endif
# ifdef gimpel
	dirs[nd++] = intss() ?  "SYS3.C." : "" ;
# endif
	/* dirs[nd++] = "/compool"; */
	dirs[nd++] = 0;
	defloc=ppsym("define");
	udfloc=ppsym("undef");
	incloc=ppsym("include");
	elsloc=ppsym("else");
	eifloc=ppsym("endif");
	ifdloc=ppsym("ifdef");
	ifnloc=ppsym("ifndef");
	ifloc=ppsym("if");
	lneloc=ppsym("line");
	for (i=sizeof(macbit)/sizeof(macbit[0]); --i>=0; ) macbit[i]=0;
# if unix
	ysysloc=stsym("unix");
# endif
# if gcos
	ysysloc=stsym ("gcos");
# endif
# if ibm
	ysysloc=stsym ("ibm");
# endif
# if pdp11
	varloc=stsym("pdp11");
# endif
# if vax
	varloc=stsym("vax");
# endif
# if interdata
	varloc=stsym ("interdata");
# endif
# if tss
	varloc=stsym ("tss");
# endif
# if os
	varloc=stsym ("os");
# endif
# if mert
	varloc=stsym ("mert");
# endif
# if mc68000
	varloc=stsym("mc68000");
# endif
# if sun
	varloc=stsym("sun");
# endif
# if BSD2_11
	varloc=stsym("BSD2_11");
# endif
# if BSD2_10
	varloc=stsym("BSD2_10");
# endif
# if BSD2_9
	varloc=stsym("BSD2_9");
# endif
	ulnloc=stsym ("__LINE__");
	uflloc=stsym ("__FILE__");

	tf=fnames[ifno]; fnames[ifno]="command line"; lineno[ifno]=1;
	cp2=prespc;
	while (cp2<predef) stsym(*cp2++);
	cp2=punspc;
	while (cp2<prund) {
		if (p=strdex(*cp2, '=')) *p++='\0';
		lookup(*cp2++, DROP);
	}
	fnames[ifno]=tf;
	pbeg=buffer+NCPS; pbuf=pbeg+BUFSIZ; pend=pbuf+BUFSIZ;

	trulvl = 0; flslvl = 0;
	lineno[0] = 1; sayline(START);
	outp=inp=pend;
	control(pend);
	return (exfail);
}
lib/cpp/cpy.y100444 000000 000012 00000002271 03746610550 007054 /*
 * @(#)cpy.y 1.2 1/2/83
 */
%term number stop DEFINED
%term EQ NE LE GE LS RS
%term ANDAND OROR
%left ','
%right '='
%right '?' ':'
%left OROR
%left ANDAND
%left '|' '^'
%left '&'
%binary EQ NE
%binary '<' '>' LE GE
%left LS RS
%left '+' '-'
%left '*' '/' '%'
%right '!' '~' UMINUS
%left '(' '.'
%%
S:	e stop	={return($1);}


e:	  e '*' e
		={$$ = $1 * $3;}
	| e '/' e
		={$$ = $1 / $3;}
	| e '%' e
		={$$ = $1 % $3;}
	| e '+' e
		={$$ = $1 + $3;}
	| e '-' e
		={$$ = $1 - $3;}
	| e LS e
		={$$ = $1 << $3;}
	| e RS e
		={$$ = $1 >> $3;}
	| e '<' e
		={$$ = $1 < $3;}
	| e '>' e
		={$$ = $1 > $3;}
	| e LE e
		={$$ = $1 <= $3;}
	| e GE e
		={$$ = $1 >= $3;}
	| e EQ e
		={$$ = $1 == $3;}
	| e NE e
		={$$ = $1 != $3;}
	| e '&' e
		={$$ = $1 & $3;}
	| e '^' e
		={$$ = $1 ^ $3;}
	| e '|' e
		={$$ = $1 | $3;}
	| e ANDAND e
		={$$ = $1 && $3;}
	| e OROR e
		={$$ = $1 || $3;}
	| e '?' e ':' e
		={$$ = $1 ? $3 : $5;}
	| e ',' e
		={$$ = $3;}
	| term
		={$$ = $1;}
term:
	  '-' term %prec UMINUS
		={$$ = -$2;}
	| '!' term
		={$$ = !$2;}
	| '~' term
		={$$ = ~$2;}
	| '(' e ')'
		={$$ = $2;}
	| DEFINED '(' number ')'
		={$$= $3;}
	| DEFINED number
		={$$ = $2;}
	| number
		={$$= $1;}
%%
# include "yylex.c"
lib/cpp/yylex.c100444 000000 000012 00000005246 05047761756 007425 /* static char sccsid[] = "@(#)yylex.c	1.3 7/1/83"; */

#define isid(a)  ((fastab+COFF)[a]&IB)
#define IB 1
/*	#if '\377' < 0		it would be nice if this worked properly!!!!! */
#if pdp11 | vax | mc68000
#define COFF 128
#else
#define COFF 0
#endif

yylex() {
	static int ifdef=0;
	static char *op2[]={"||",  "&&" , ">>", "<<", ">=", "<=", "!=", "=="};
	static int  val2[]={OROR, ANDAND,  RS,   LS,   GE,   LE,   NE,   EQ};
	static char *opc="b\bt\tn\nf\fr\r\\\\";
	extern char fastab[];
	extern char *outp,*inp,*newp; extern int flslvl;
	register char savc, *s; char *skipbl(); int val;
	register char **p2;
	struct symtab {
		char *name;
		char *value;
	} *sp, *lookup();

for (;;) {
	extern int passcom;		/* this crap makes #if's work */
	int opt_passcom = passcom;	/* even with -C option */
	passcom = 0;			/* (else comments make syntax errs) */
	newp=skipbl(newp);
	passcom = opt_passcom;		/* nb: lint uses -C so its useful! */
	if (*inp=='\n') return(stop);	/* end of #if */
	savc= *newp; *newp='\0';
	for (p2=op2+8; --p2>=op2; )	/* check 2-char ops */
		if (0==strcmp(*p2,inp)) {val=val2[p2-op2]; goto ret;}
	s="+-*/%<>&^|?:!~(),";	/* check 1-char ops */
	while (*s) if (*s++== *inp) {val= *--s; goto ret;}
	if (*inp<='9' && *inp>='0') {/* a number */
		if (*inp=='0') yylval= (inp[1]=='x' || inp[1]=='X') ?
			tobinary(inp+2,16) : tobinary(inp+1,8);
		else yylval=tobinary(inp,10);
		val=number;
	} else if (isid(*inp)) {
		if (0==strcmp(inp,"defined")) {ifdef=1; ++flslvl; val=DEFINED;}
		else {
			sp=lookup(inp,-1); if (ifdef!=0) {ifdef=0; --flslvl;}
			yylval= (sp->value==0) ? 0 : 1;
			val=number;
		}
	} else 	if (*inp=='\'') {/* character constant */
		val=number;
		if (inp[1]=='\\') {/* escaped */
			char c; if (newp[-1]=='\'') newp[-1]='\0';
			s=opc;
			while (*s) if (*s++!=inp[2]) ++s; else {yylval= *s; goto ret;}
			if (inp[2]<='9' && inp[2]>='0') yylval=c=tobinary(inp+2,8);
			else yylval=inp[2];
		} else yylval=inp[1];
	} else if (0==strcmp("\\\n",inp)) {*newp=savc; continue;}
	else {
		*newp=savc; pperror("Illegal character %c in preprocessor if", *inp);
		continue;
	}
ret:
	*newp=savc; outp=inp=newp; return(val);
}
}

tobinary(st, b) char *st; {
	int n, c, t;
	char *s;
	n=0;
	s=st;
	while (c = *s++) {
	switch(c) {
		case '0': case '1': case '2': case '3': case '4': 
		case '5': case '6': case '7': case '8': case '9': 
			t = c-'0'; break;
		case 'a': case 'b': case 'c': case 'd': case 'e': case 'f': 
			t = c-'a'+10; if (b>10) break;
		case 'A': case 'B': case 'C': case 'D': case 'E': case 'F': 
			t = c - 'A'+10; if (b>10) break;
		default:
			t = -1;
			if ( c=='l' || c=='L') if (*s=='\0') break;
			pperror("Illegal number %s", st);
	}
	if (t<0) break;
	n = n*b+t;
	}
return(n);
}
lib/cpp/Makefile100444 000000 000000 00000001702 06171337216 007522 ((#	Makefile	1.3	(2.11BSD) 96/7/11
#

# Defined SHARED_DATA to be whatever will make your compiler make initialized
# variables shared and read only.  Don't do this on a PDP-11 if you're also
# compiling separate I&D since doing so puts the shared data in text space
# which can't be accessed normally.
#
#SHARED_DATA=-R

# CFLAGS=-O -Dunix=1 -DFLEXNAMES
# If you don't have split I/D, you'll have to edit the constant
# SBSIZE in cpp.c to reflect this.

CFLAGS=-O -Dpdp11=1 -DFLEXNAMES -DBSD2_11 -UBSD2_10
SEPFLAG=-i

cpp :	cpp.o cpy.o rodata.o
	$(CC) $(CFLAGS) $(SEPFLAG) -o cpp rodata.o cpp.o cpy.o

cpy.c : cpy.y
	yacc cpy.y
	../pcc/:yyfix yyexca yyact yypact yypgo yyr1 yyr2 yychk yydef
	mv y.tab.c cpy.c

cpy.o :	cpy.c yylex.c

rodata.o : cpy.c
	$(CC) $(CFLAGS) ${SHARED_DATA} -c rodata.c

clean :
	rm -f *.s *.o cpy.c rodata.c cpp

install : cpp
	install -s cpp $(DESTDIR)/lib

sources : cpp.c cpy.y yylex.c README
cpp.c cpy.y yylex.c README :
	sccs get $@
lib/ccom/040755 000000 000012 00000000000 07100464740 006220 lib/ccom/TEST/040755 000000 000024 00000000000 07100464737 007010 lib/ccom/TEST/tst_pntint.c100444 000000 000024 00000001657 03746610556 011377 main()
{
	short	s;
	int	i;
	long	l;
	float	f;
	char	*p;

	s = "s = ...";		/* $L4 assigned to s		*/
	i = "i = ...";		/* $L5 assigned to i		*/

	l = "l = ...";		/* $L6 assigned to low word of l,
				 * upper word cleared
				 */

/*	f = "f = ...";		/* totally illegal		*/

	s = p;			/* p assigned to s		*/
	i = p;			/* p assigned to i		*/

	l = p;			/* p assigned to low word of l,
				 * upper word cleared.
				 */

/*	f = p;			/* totally illegal		*/

	p = 'a';
	p = 5;
	p = 15L;
	p = 100000L;		/* -74540(8) is assigned to p, with no
				 * truncation warning, but then the same
				 * thing happens with the next statement,
				 * so this is a global error
				 */

	i = 100000L;		/* -74540(8) assigned to i	*/

	p = s;			/* s assigned to p		*/
	p = i;			/* i assigned to p		*/
	p = l;			/* low word of l assigned to p	*/
/*	p = f;			/* totally illegal		*/

	l = i;			/* i assigned to low word of l,
				 * upper word sign extended
				 */
}
lib/ccom/TEST/old-assn.l100444 000000 000024 00000006537 04025500675 010713 %{
/*
 * old-assn.l - find old C assignment operators
 *
 * Quick little lex program to find occurances of old form assignment
 * operators in C source programs: =-, =+, etc.
 *
 * usage: old-assn [file] ...
 *
 * NOTES:
 *	Won't work on files with lines longer than MAXLINE
 *	File names should be less than MAXPATHLEN in length ...
 *	The standard lex environment already includes <stdio.h>
 *	"yyin" is where lex reads its input from
 *	lex keeps the current input line number in "yylineno"
 */

#include <sys/param.h>
#define	MAXLINE		1024

static char	*ourname,		/* guess */
		**filelist;		/* list of files we're checking */
static int	errors = 0,		/* number of errors of course! */
		printnames = 0;		/* if more than one file to scan */

main(argc, argv)
	int	argc;
	char	**argv;
{
	char	*C,
		*rindex();

	ourname = (C = rindex(*argv,'/')) ? ++C : *argv;
	if (argc == 1)
	{
		static char	*siv[] = { "stdin", (char *)0 };
		filelist = siv;
	}
	else
	{
		filelist = argv+1;
		printnames = 1;
		if (yyopen() == 1)
			exit(errors);
	}
	yylex();
	exit(errors);
}

/*
 * Open next file when end of file reached on current input.
 */
yywrap()
{
	filelist++;
	return(yyopen());
}

/*
 * Open next file from filelist and set it up as lex's input.  Return 1
 * when no more files can be opened, 0 on success.
 */
yyopen()
{
	fclose(yyin);
	yylineno = 1;
	for (;;)
	{
		if (!*filelist)
			return(1);
		if (yyin = fopen(*filelist, "r"))
			return(0);
		else
		{
			perror(*filelist);
			errors++;
			filelist++;
		}
	}
}

/*
 * Catch cpp "# lineno file" controls and use them to set our current idea of
 * what file we're reading and what line number we're on.
 */
yypunt(yytext)
	char	*yytext;
{
	static char	curfile[MAXPATHLEN];
	register char	*cp	= curfile,
			*yp	= yytext;

	while (*yp < '0' || '9' < *yp)
		yp++;
	yylineno = *yp++ - '0';
	while ('0' <= *yp && *yp <= '9')
		yylineno = 10*yylineno + *yp++ - '0';

	while (*yp++ != '\"')
		continue;
	while (*yp != '\"')
		*cp++ = *yp++;
	*cp = '\0';
	*filelist = curfile;
}
%}

%%

%{
	/*
	 * The following definitions will appear within the function yylex.
	 * Note that yylex must *not* return except at an end of line or at
	 * end of file or the line buffer variable will be trashed (and *no*,
	 * you can't have a "static register ..."  The use of register
	 * variables for "linep", "bufend" and "cp" below in the macro
	 * catenate speeds this program up by about 10%).
	 */

#define	CATENATE(s) \
	{ \
		for (cp = s;linep < bufend && *cp;*linep++ = *cp++); \
		*linep = '\0'; \
	}

	static char	linebuf[MAXLINE+1];	/* current input line */
	register char	*linep	= linebuf,	/* linebuf input pointer */
			*bufend	= linebuf+MAXLINE+1,
			*cp;
	static short	oldassn	= 0,		/* old assignment in line */
			string	= 0;		/* if in a string */

%}

^\#(line)?\ [0-9]+\ \".*\"\n	yypunt(yytext);

[^<>!=]=[-+*&]	|
=[/%^|]		|
=>>		|
=<<		{
			if (!string)
				oldassn = 1;
			CATENATE(yytext);
		}

\\\"		CATENATE(yytext);

\"		{
			string = !string;
			CATENATE(yytext);
		}

\n		{
			/*
			 * If an old assignment occured on this line,
			 * then print the file name, line number and
			 * and line ala grep.
			 */
			if (oldassn) {
				if (printnames)
					printf("%s: %d: %s\n",
						*filelist, yylineno-1, linebuf);
				else
					printf("%d: %s\N",
						yylineno-1, linebuf);
				oldassn = 0;
			}
			string = 0;
			*(linep = linebuf) = '\0';
		}

.		CATENATE(yytext);
lib/ccom/TEST/ctest100444 000000 000024 00000000437 03746610556 010065 x=`basename $1 .c`
if test "$2" != s -a "$3" != s
then
	echo compiling with old
	cc -S $x.c
	echo finished compiling old
	mv $x.s $x.so
fi
if test $2x = 0x
then
	cc -t0 -S $x.c
fi
if test $2 = 1
then
	cc -t1 -S $x.c
fi
if test $2 != 0 -a $2 != 1
then
	cc -t01 -S $x.c
fi
diff $x.so $x.s
lib/ccom/TEST/tst_adec.c100444 000000 000024 00000000330 03746610556 010742 int	arr[100], x;
long	p_end;
main()
{
	puts("test autodecrement inside array reference:");
	p_end = 0;
	printf("before %ld (should be 0)\n", p_end);
	x = arr[p_end--];
	printf("after %ld (should be -1)\n", p_end);
}
lib/ccom/TEST/tpr.c100444 000000 000024 00000010024 03746610557 007763 ((/*
 * Interpret a C intermediate file.
 */
#include <stdio.h>
#include "c1.h"

extern	opdope[1];
extern	char	*opntab[1];

struct table cctab[1], efftab[1], regtab[1], sptab[1];
char	maprel[1], notrel[1];
char	*outname();

main()
{
	register t, op;
	static char s[9];
	register char *tp;
	double atof();
	char numbuf[64];
	int lbl, cond;
	int sdep;

	sdep = 0;
	for (;;) {
		op = getw(stdin);
		if ((op&0177400) != 0177000) {
			error("Intermediate file error");
			exit(1);
		}
		lbl = 0;
		switch(op &= 0377) {

	case SINIT:
		printf("init %d\n", getw(stdin));
		break;

	case EOFC:
		printf("eof\n");
		exit(0);

	case BDATA:
		if (getw(stdin) == 1) {
			printf(".byte ");
			for (;;)  {
				printf("%d", getw(stdin));
				if (getw(stdin) != 1)
					break;
				printf(",");
			}
			printf("\n");
		}
		break;

	case PROG:
		printf("prog\n");
		break;

	case DATA:
		printf("data\n");
		break;

	case BSS:
		printf("bss\n");
		break;

	case SYMDEF:
		printf("symdef ");
		outname(s);
		printf("%s\n", s);
		break;

	case RETRN:
		printf("return\n");
		break;

	case CSPACE:
		tp = outname(s);
		printf("comm %s,%d\n", tp, getw(stdin));
		break;

	case SSPACE:
		printf("space %d\n", getw(stdin));
		break;

	case EVEN:
		printf("even\n");
		break;

	case SAVE:
		printf("save\n");
		break;

	case SETSTK:
		t = getw(stdin)-6;
		printf("setstack %d\n", t);
		break;

	case PROFIL:
		t = getw(stdin);
		printf("profil %d\n", t);
		break;

	case SNAME:
		tp = outname(s);
		printf("sname %s s%d\n", tp, getw(stdin));
		break;

	case ANAME:
		tp = outname(s);
		printf("aname %s a%d\n", tp, getw(stdin));
		break;

	case RNAME:
		tp = outname(s);
		printf("rname %s r%d\n", tp, getw(stdin));
		break;

	case SWIT:
		t = getw(stdin);
		line = getw(stdin);
		printf("switch line %d def %d\n", line, t);
		while (t = getw(stdin)) {
			printf("   %d %d\n", t, getw(stdin));
		}
		break;

	case CBRANCH:
		lbl = getw(stdin);
		cond = getw(stdin);
	case EXPR:
		line = getw(stdin);
		if (sdep != 1) {
			error("Expression input botch");
			exit(1);
		}
		sdep = 0;
		if (lbl)
			printf("cbranch %d line %d\n", lbl, line);
		else
			printf("expr line %d\n", line);
		break;

	case NAME:
		t = getw(stdin);
		if (t==EXTERN) {
			t = getw(stdin);
			printf("name %o, %s\n", t, outname(s));
		} else if (t==AUTO) {
			t = getw(stdin);
			printf("name %o a%d\n", t, getw(stdin));
		} else if (t==STATIC) {
			t = getw(stdin);
			printf("name %o s%d\n", t, getw(stdin));
		} else if (t==REG) {
			t = getw(stdin);
			printf("name %o r%d\n", t, getw(stdin));
		} else
			printf("name botch\n");
		sdep++;
		break;

	case CON:
		t = getw(stdin);
		printf("const %d %d\n", t, getw(stdin));
		sdep++;
		break;

	case LCON:
		getw(stdin);	/* ignore type, assume long */
		t = getw(stdin);
		op = getw(stdin);
		printf("lconst %D\n", (((long)t<<16) | (unsigned)op));
		sdep++;
		break;

	case FCON:
		t = getw(stdin);
		printf("fcon %s\n", outname(numbuf));
		sdep++;
		break;

	case FSEL:
		printf("fsel %o ", getw(stdin));
		printf("%d ", getw(stdin));
		printf("%d\n", getw(stdin));
		break;

	case STRASG:
		t = getw(stdin);
		printf("strasg %o ", getw(stdin));
		printf("%d\n", getw(stdin));
		break;

	case NULLOP:
		printf("null\n");
		sdep++;
		break;

	case LABEL:
		printf("label %d\n", getw(stdin));
		break;

	case NLABEL:
		tp = outname(s);
		printf("nlabel %s\n", tp);
		break;

	case RLABEL:
		tp = outname(s);
		printf("rlabel %s\n", tp);
		break;

	case BRANCH:
		printf("branch %d\n", getw(stdin));
		break;

	case SETREG:
		printf("nreg %d\n", getw(stdin));
		break;

	default:
		t = getw(stdin);
		if (op <=0 || op >=120) {
			printf("Unknown op %d\n", op);
			exit(1);
		}
		if (opdope[op]&BINARY)
			sdep--;
		if (sdep<=0)
			printf("Binary expression botch\n");
		if (opntab[op] == 0)
			printf("op %d %o\n", op, t);
		else
			printf("%s %o\n", opntab[op], t);
		break;
	}
	}
}

char *
outname(s)
char *s;
{
	register char *p, c;
	register n;

	p = s;
	n = 0;
	while (c = getc(stdin)) {
		*p++ = c;
		n++;
	}
	do {
		*p++ = 0;
	} while (n++ < 8);
	return(s);
}

error(s)
char *s;
{
	printf("%s\n", s);
	exit(1);
}
lib/ccom/TEST/tprint.c100444 000000 000024 00000005670 03746610557 010511 /*
 * tree printer routine for C
 */

#include "c1.h"

char *strop[] {
"0",
";",
"{",
"}",
"[",
"]",
"(",
")",
":",
",",
"10",
"11",
"12",
"13",
"14",
"15",
"16",
"17",
"18",
"19",
"",
"",
"string",
"fcon",
"sfcon",
"25",
"26",
"",
"",
"sizeof",
"++pre",
"--pre",
"++post",
"--post",
"!un",
"&un",
"*un",
"-un",
"~un",
".",
"+",
"-",
"*",
"/",
"%",
">>",
"<<",
"&",
"|",
"^",
"->",
"itof",
"ftoi",
"&&",
"||",
"&~",
"ftol",
"ltof",
"itol",
"ltoi",
"==",
"!=",
"<=",
"<",
">=",
">",
"<p",
"<=p",
">p",
">=p",
"=+",
"=-",
"=*",
"=/",
"=%",
"=>>",
"=<<",
"=&",
"=|",
"=^",
"=",
"&(test)",
"82",
"83",
"84",
"=&~",
"86",
"87",
"88",
"89",
"?",
"91",
"92",
"93",
"94",
"95",
"96",
"97",
"98",
"99",
"call",
"mcall",
"jump",
"cbranch",
"init",
"setreg",
"106",
"107",
"108",
"109",
"forcereg",
};

treeprint(tp)
struct tnode *tp;
{
	register f;
	extern fout;
	static tout;

	if (tout==0)
		tout = dup(1);
	flush();
	f = fout;
	fout = tout;
	printf("\n");
	tprt(tp, 0);
	flush();
	fout = f;
}

tprt(at, al)
struct tnode *at;
{
	register struct tnode *t;
	register i, l;

	t = at;
	l = al;
	if (i=l)
		do
			printf(". ");
		while (--i);
	if (t<treebase || t>=spacemax) {
		printf("%o: bad tree ptr\n", t);
		return;
	}
	if (t->op<0 || t->op>RFORCE) {
		printf("%d\n", t->op);
		return;
	}
	printf("%s", strop[t->op]);
	switch (t->op) {

	case SETREG:
		printf("%d\n", t->type);
		return;

	case PLUS:
	case MINUS:
	case TIMES:
	case DIVIDE:
	case MOD:
	case LSHIFT:
	case RSHIFT:
	case AND:
	case OR:
	case EXOR:
	case NAND:
	case LOGAND:
	case LOGOR:
	case EQUAL:
	case NEQUAL:
	case LESSEQ:
	case LESS:
	case GREATEQ:
	case GREAT:
	case LESSEQP:
	case LESSP:
	case GREATQP:
	case GREATP:
	case ASPLUS:
	case ASMINUS:
	case ASTIMES:
	case ASDIV:
	case ASMOD:
	case ASRSH:
	case ASLSH:
	case ASSAND:
	case ASSNAND:
	case ASOR:
	case ASXOR:
	case ASSIGN:
	case QUEST:
	case CALL:
	case MCALL:
	case CALL1:
	case CALL2:
	case TAND:
		prtype(t);

	case COLON:
	case COMMA:
		printf("\n");
		tprt(t->tr1, l+1);
		tprt(t->tr2, l+1);
		return;

	case INCBEF:
	case INCAFT:
	case DECBEF:
	case DECAFT:
		printf(" (%d)", t->tr2);

	case EXCLA:
	case AMPER:
	case STAR:
	case NEG:
	case COMPL:
	case INIT:
	case JUMP:
	case LOAD:
	case RFORCE:
	case ITOF:
	case FTOI:
	case FTOL:
	case LTOF:
	case LTOI:
	case ITOL:
		prtype(t);
		printf("\n");
		tprt(t->tr1, l+1);
		return;

	case NAME:
	case CON:
	case SFCON:
	case FCON:
	case AUTOI:
	case AUTOD:
		pname(t, 0);
		prtype(t);
		printf("\n");
		return;

	case CBRANCH:
		printf(" (L%d)\n", t->lbl);
		tprt(t->btree, l+1);
		return;

	default:
		printf(" unknown\n");
		return;
	}
}

char *typetab[] {
	"int",
	"char",
	"float",
	"double",
	"struct",
	"(?5)",
	"long",
	"(?7)",
};

char	*modtab[] {
	0,
	"*",
	"()",
	"[]",
};

prtype(atp)
struct tnode *atp;
{
	register struct tnode *tp;
	register t;

	tp = atp;
	printf(" %s", typetab[tp->type&07]);
	t = (tp->type>>3) & 017777;
	while (t&03) {
		printf(modtab[t&03]);
		t =>> 2;
	}
	printf(" (%d)", tp->degree);
}
