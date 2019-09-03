'static'; var TEXT_WHO_STARTS = '';
'static'; var TEXT_THROW_DICE = '';
'static'; var TEXT_TOSS_COIN  = '';
'static'; var TEXT_APPLY      = '';
'static'; var TEXT_START      = 'Start';
'static'; var TEXT_BACK       = '';
'static'; var TEXT_COIN1      = '';
'static'; var TEXT_COIN2      = '';
'static'; var TEXT_SETTINGS   = '';
'static'; var TEXT_A_SETTINGS = '';
'static'; var TEXT_LANG       = '';
'static'; var TEXT_TIMER      = '';
'static'; var TEXT_REMOTE     = '';
'static'; var TEXT_INIT_SCORE = '';
'static'; var TEXT_INIT_SUBSCR= '';
'static'; var TEXT_USE_SUBSCR = '';
'static'; var TEXT_USE_HISTORY= '';
'static'; var TEXT_USE_REMOTE = '';
'static'; var TEXT_APPID      = 'AppID';
'static'; var TEXT_DICE_COUNT = '';
'static'; var TEXT_PL_COUNT   = '';
'static'; var TEXT_PL_COLORS  = '';
'static'; var TEXT_COUNTDOWN  = '';
'static'; var TEXT_PLAY       = '▷'; // https://stackoverflow.com/a/27053825/6603609
'static'; var TEXT_PAUSE      = '❘ ❘';
'static'; var TEXT_STOP       = '◻';
'static'; var TEXT_RESTART    = '⟲';
'static'; var TEXT_END        = 'KONEC';
'static'; var TEXT_DICE_SIDES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
'static'; var TEXT_SCORE_HIST = '📓';

'static'; function SetLanguageCzech() {
    TEXT_WHO_STARTS = 'Kdo začne?';
    TEXT_THROW_DICE = 'Hoď kostkami';
    TEXT_TOSS_COIN  = 'Hoď mincí';
    TEXT_APPLY      = 'Použít';
    TEXT_BACK       = 'Zpět';
    TEXT_COIN1      = 'Hlava';
    TEXT_COIN2      = 'Orel';
    TEXT_SETTINGS   = 'Nastavení';
    TEXT_A_SETTINGS = 'Pokročilé nastavení';
    TEXT_LANG       = 'Jazyk';
    TEXT_TIMER      = 'Nezdržuj';
    TEXT_REMOTE     = 'Vzdálená správa';
    TEXT_INIT_SCORE = 'Počáteční skóre';
    TEXT_INIT_SUBSCR= 'Počáteční subskóre';
    TEXT_USE_SUBSCR = 'Povolit subskóre';
    TEXT_USE_HISTORY= 'Povolit historii hodů';
    TEXT_USE_REMOTE = 'Povolit vzdálenou správu';
    TEXT_DICE_COUNT = 'Počet kostek';
    TEXT_PL_COUNT   = 'Počet hráčů';
    TEXT_PL_COLORS  = 'Barvy hráčů';
    TEXT_COUNTDOWN  = 'Odpočet';
    TEXT_END        = 'KONEC';
}

'static'; function SetLanguageEnglish() {
    TEXT_WHO_STARTS = 'Who\'ll start?';
    TEXT_THROW_DICE = 'Throw dice';
    TEXT_TOSS_COIN  = 'Toss coin';
    TEXT_APPLY      = 'Apply';
    TEXT_BACK       = 'Back';
    TEXT_COIN1      = 'Head';
    TEXT_COIN2      = 'Tail';
    TEXT_SETTINGS   = 'Settings';
    TEXT_A_SETTINGS = 'Advanced settings';
    TEXT_LANG       = 'Language';
    TEXT_TIMER      = 'Timer';
    TEXT_REMOTE     = 'Remote control';
    TEXT_INIT_SCORE = 'Initial score';
    TEXT_INIT_SUBSCR= 'Initial subscore';
    TEXT_USE_SUBSCR = 'Enable subscore';
    TEXT_USE_HISTORY= 'Enable throw history';
    TEXT_USE_REMOTE = 'Enable remote control';
    TEXT_DICE_COUNT = 'Dice count';
    TEXT_PL_COUNT   = 'Player count';
    TEXT_PL_COLORS  = 'Player colors';
    TEXT_COUNTDOWN  = 'Countdown';
    TEXT_END        = 'TIME UP';
}

'static'; function SetLanguageById(id) {
    [
        SetLanguageCzech,
        SetLanguageEnglish,
    ][id]();
    ClearOptimizationCache();
}