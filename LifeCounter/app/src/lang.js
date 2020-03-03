'static'; var TEXT_EDIT_SCORE = '';
'static'; var TEXT_SCORE      = '';
'static'; var TEXT_SUBSCORE   = '';
'static'; var TEXT_WHO_STARTS = '';
'static'; var TEXT_THROW_DICE = '';
'static'; var TEXT_TOSS_COIN  = '';
'static'; var TEXT_WHOLL_START= '';
'static'; var TEXT_APPLY      = '';
'static'; var TEXT_START      = 'Start';
'static'; var TEXT_BACK       = '';
'static'; var TEXT_SETTINGS   = '';
'static'; var TEXT_A_SETTINGS = '';
'static'; var TEXT_LANG       = '';
'static'; var TEXT_TIMER      = '';
'static'; var TEXT_INIT_SCORE = '';
'static'; var TEXT_INIT_SUBSCR= '';
'static'; var TEXT_USE_SUBSCR = '';
'static'; var TEXT_USE_THROW_HISTORY = '';
'static'; var TEXT_USE_SCORE_HISTORY = '';
'static'; var TEXT_USE_TIME_TRACK = '';
'static'; var TEXT_USE_SCORE_EDIT = '';
'static'; var TEXT_DICE_COUNT = '';
'static'; var TEXT_PL_COUNT   = '';
'static'; var TEXT_PL_COLORS  = '';
'static'; var TEXT_PLAY       = '▷'; // https://stackoverflow.com/a/27053825/6603609
'static'; var TEXT_PAUSE      = '❘ ❘';
'static'; var TEXT_STOP       = '◻';
'static'; var TEXT_RESTART    = '⟲';
'static'; var TEXT_END        = '--:--';
'static'; var TEXT_COIN_SIDES = [];
'static'; var TEXT_DICE_SIDES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
'static'; var TEXT_EDITOR_SET = '';
'static'; var TEXT_EDITOR_ADD = '';
'static'; var TEXT_EDITOR_SUB = '';

'static'; function SetLanguageCzech() {
	TEXT_SCORE      = 'skóre';
	TEXT_SUBSCORE   = 'subskóre'
	TEXT_EDIT_SCORE = 'Uprav ' + TEXT_SCORE;
	TEXT_WHO_STARTS = 'Náhoda';
	TEXT_THROW_DICE = 'Kostky';
	TEXT_TOSS_COIN  = 'Mince';
	TEXT_WHOLL_START= 'Kdo začne?';
	TEXT_APPLY      = 'Použít';
	TEXT_BACK       = 'Zpět';
	TEXT_COIN_SIDES = ['Hlava', 'Orel'];
	TEXT_SETTINGS   = 'Nastavení';
	TEXT_A_SETTINGS = 'Pokročilé';
	TEXT_LANG       = 'Jazyk';
	TEXT_TIMER      = 'Nezdržuj';
	TEXT_INIT_SCORE = 'Počáteční ' + TEXT_SCORE;
	TEXT_INIT_SUBSCR= 'Počáteční ' + TEXT_SUBSCORE;
	TEXT_USE_SUBSCR = 'Povolit ' + TEXT_SUBSCORE;
	TEXT_USE_THROW_HISTORY = 'Povolit historii hodů';
	TEXT_USE_SCORE_HISTORY = 'Povolit historii ' + TEXT_SCORE;
	TEXT_USE_TIME_TRACK = 'Povolit sledování času';
	TEXT_USE_SCORE_EDIT = 'Povolit editaci ' + TEXT_SCORE;
	TEXT_DICE_COUNT = 'Počet kostek';
	TEXT_PL_COUNT   = 'Počet hráčů';
	TEXT_PL_COLORS  = 'Barvy hráčů';
	TEXT_EDITOR_SET = 'Nastavit';
	TEXT_EDITOR_ADD = 'Přičíst';
	TEXT_EDITOR_SUB = 'Odečíst';
}

'static'; function SetLanguageEnglish() {
	TEXT_SCORE      = 'score';
	TEXT_SUBSCORE   = 'subscore'
	TEXT_EDIT_SCORE = 'Edit ' + TEXT_SCORE;
	TEXT_WHO_STARTS = 'Chance';
	TEXT_THROW_DICE = 'Dice';
	TEXT_TOSS_COIN  = 'Coin';
	TEXT_WHOLL_START= 'Who\'ll start?';
	TEXT_APPLY      = 'Apply';
	TEXT_BACK       = 'Back';
	TEXT_COIN_SIDES = ['Head', 'Tail'];
	TEXT_SETTINGS   = 'Settings';
	TEXT_A_SETTINGS = 'Advanced';
	TEXT_LANG       = 'Language';
	TEXT_TIMER      = 'Timer';
	TEXT_INIT_SCORE = 'Initial ' + TEXT_SCORE;
	TEXT_INIT_SUBSCR= 'Initial ' + TEXT_SUBSCORE;
	TEXT_USE_SUBSCR = 'Enable ' + TEXT_SUBSCORE;
	TEXT_USE_THROW_HISTORY = 'Enable throw history';
	TEXT_USE_SCORE_HISTORY = 'Enable ' + TEXT_SCORE + ' history';
	TEXT_USE_TIME_TRACK = 'Enable time tracking';
	TEXT_DICE_COUNT = 'Dice count';
	TEXT_PL_COUNT   = 'Player count';
	TEXT_PL_COLORS  = 'Player colors';
	TEXT_EDITOR_SET = 'Set';
	TEXT_EDITOR_ADD = 'Add';
	TEXT_EDITOR_SUB = 'Substract';
}

'static'; function SetLanguageById(id) {
	if (id == 0) SetLanguageCzech();
	else SetLanguageEnglish();
	ClearFontSizeCache();
}

'static'; function GetPhraseScoreHistory(whichText, langId) {
	if (langId == 0) {
		return '&nbsp;historie ' + whichText + ':';
	}
	return '&nbsp;' + whichText + ' history:';
}