// The three formulas the Analyst Agent writes (content/DEMOS.md §2 step 4). OWNER: demo-analyst.
// Shared by the steps (formula bar) and the markup (panel, transcript).
export const F_MARGIN = '=H2-I2-J2';
export const F_GM_PCT = '=IFERROR(K2/H2,0)';
export const F_SUMIFS = '=SUMIFS(Clean!$K:$K,Clean!$E:$E,$A5,Clean!$A:$A,">="&B$4,Clean!$A:$A,"<="&EOMONTH(B$4,0))';
