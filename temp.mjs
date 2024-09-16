
        'use strict'

        import {_} from './support.mjs';
        import * as ohm from 'ohm-js';

        let return_value_stack = [];
        let rule_name_stack = [];

        const grammar = String.raw`
    internalize {
  text = char+
  char =
    | dq (~dq stringchar)* dq -- string
    | "//" (~nl stringchar)* nl -- comment
    | "❲" wordchar+ "❳" -- word
    | ~"❲" ~"❳" any -- any

  stringchar = " " | nl | "\t" | "<" | ">" | "&" | quoteddq | sq | dq | any 

  wordchar =
    | "❲" wordchar+ "❳" -- rec
    | ~"❲" ~"❳" any -- bottom
    
  quoteddq = "\\" dq
  sq = "'"
  dq = "\""
  nl = "\n"
}
`;

const rewrite_js = {
text : function (_c, ) {
let c = undefined;
return_value_stack.push ("");
rule_name_stack.push ("");
_.set_top (rule_name_stack, "text");
c = _c.rwr ().join ('')


_.set_top (return_value_stack, `${c}`);

rule_name_stack.pop ();
return return_value_stack.pop ();
},
char_string : function (_ldq, _cs, _rdq, ) {
let ldq = undefined;
let cs = undefined;
let rdq = undefined;
return_value_stack.push ("");
rule_name_stack.push ("");
_.set_top (rule_name_stack, "char_string");
ldq = _ldq.rwr ()
cs = _cs.rwr ().join ('')
rdq = _rdq.rwr ()


_.set_top (return_value_stack, `${ldq}${_.encodews (`${cs}`)}${rdq}`);

rule_name_stack.pop ();
return return_value_stack.pop ();
},
char_comment : function (_kcomment, _cs, _nl, ) {
let kcomment = undefined;
let cs = undefined;
let nl = undefined;
return_value_stack.push ("");
rule_name_stack.push ("");
_.set_top (rule_name_stack, "char_comment");
kcomment = _kcomment.rwr ()
cs = _cs.rwr ().join ('')
nl = _nl.rwr ()


_.set_top (return_value_stack, `⌈${_.encodews (`${cs}`)}⌉\n`);

rule_name_stack.pop ();
return return_value_stack.pop ();
},
char_word : function (_lb, _cs, _rb, ) {
let lb = undefined;
let cs = undefined;
let rb = undefined;
return_value_stack.push ("");
rule_name_stack.push ("");
_.set_top (rule_name_stack, "char_word");
lb = _lb.rwr ()
cs = _cs.rwr ().join ('')
rb = _rb.rwr ()


_.set_top (return_value_stack, `${lb}${_.encodeURIComponent (`${cs}`)}${rb}`);

rule_name_stack.pop ();
return return_value_stack.pop ();
},
char_any : function (_c, ) {
let c = undefined;
return_value_stack.push ("");
rule_name_stack.push ("");
_.set_top (rule_name_stack, "char_any");
c = _c.rwr ()


_.set_top (return_value_stack, `${c}`);

rule_name_stack.pop ();
return return_value_stack.pop ();
},
stringchar : function (_c, ) {
let c = undefined;
return_value_stack.push ("");
rule_name_stack.push ("");
_.set_top (rule_name_stack, "stringchar");
c = _c.rwr ()


_.set_top (return_value_stack, `${c}`);

rule_name_stack.pop ();
return return_value_stack.pop ();
},
wordchar_rec : function (_lb, _cs, _rb, ) {
let lb = undefined;
let cs = undefined;
let rb = undefined;
return_value_stack.push ("");
rule_name_stack.push ("");
_.set_top (rule_name_stack, "wordchar_rec");
lb = _lb.rwr ()
cs = _cs.rwr ().join ('')
rb = _rb.rwr ()


_.set_top (return_value_stack, `${lb}${cs}${rb}`);

rule_name_stack.pop ();
return return_value_stack.pop ();
},
wordchar_bottom : function (_c, ) {
let c = undefined;
return_value_stack.push ("");
rule_name_stack.push ("");
_.set_top (rule_name_stack, "wordchar_bottom");
c = _c.rwr ()


_.set_top (return_value_stack, `${c}`);

rule_name_stack.pop ();
return return_value_stack.pop ();
},
quoteddq : function (_bsl, _dq, ) {
let bsl = undefined;
let dq = undefined;
return_value_stack.push ("");
rule_name_stack.push ("");
_.set_top (rule_name_stack, "quoteddq");
bsl = _bsl.rwr ()
dq = _dq.rwr ()


_.set_top (return_value_stack, `${dq}`);

rule_name_stack.pop ();
return return_value_stack.pop ();
},
sq : function (_c, ) {
let c = undefined;
return_value_stack.push ("");
rule_name_stack.push ("");
_.set_top (rule_name_stack, "sq");
c = _c.rwr ()


_.set_top (return_value_stack, `${c}`);

rule_name_stack.pop ();
return return_value_stack.pop ();
},
dq : function (_c, ) {
let c = undefined;
return_value_stack.push ("");
rule_name_stack.push ("");
_.set_top (rule_name_stack, "dq");
c = _c.rwr ()


_.set_top (return_value_stack, `${c}`);

rule_name_stack.pop ();
return return_value_stack.pop ();
},
nl : function (_c, ) {
let c = undefined;
return_value_stack.push ("");
rule_name_stack.push ("");
_.set_top (rule_name_stack, "nl");
c = _c.rwr ()


_.set_top (return_value_stack, `${c}`);

rule_name_stack.pop ();
return return_value_stack.pop ();
},
    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c.rwr ()); }
};





    // ~~~~~~ stock main ~~~~~~
    function main (src) {
        let parser = ohm.grammar (grammar);
        let cst = parser.match (src);
        if (cst.succeeded ()) {
            let cstSemantics = parser.createSemantics ();
            cstSemantics.addOperation ('rwr', rewrite_js);
            var generated_code = cstSemantics (cst).rwr ();
            return generated_code;
        } else {
            return cst.message;     
        }
    }

    import * as fs from 'fs';
    let src = fs.readFileSync(0, 'utf-8');
    var result = main (src);
    console.log (result);
    


