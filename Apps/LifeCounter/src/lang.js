'static'; var TEXT_WHO_STARTS = '';
'static'; var TEXT_THROW_DICE = '';
'static'; var TEXT_TOSS_COIN  = '';
'static'; var TEXT_WHOLL_START= '';
'static'; var TEXT_APPLY      = '';
'static'; var TEXT_START      = 'Start';
'static'; var TEXT_BACK       = '';
'static'; var TEXT_COIN1      = '';
'static'; var TEXT_COIN2      = '';
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
'static'; var TEXT_DICE_COUNT = '';
'static'; var TEXT_PL_COUNT   = '';
'static'; var TEXT_PL_COLORS  = '';
'static'; var TEXT_COUNTDOWN  = '';
'static'; var TEXT_PLAY       = '▷'; // https://stackoverflow.com/a/27053825/6603609
'static'; var TEXT_PAUSE      = '❘ ❘';
'static'; var TEXT_STOP       = '◻';
'static'; var TEXT_RESTART    = '⟲';
'static'; var TEXT_END        = '--:--';
'static'; var TEXT_DICE_SIDES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

'static'; function SetLanguageCzech() {
    TEXT_WHO_STARTS = 'Náhoda';
    TEXT_THROW_DICE = 'Kostky';
    TEXT_TOSS_COIN  = 'Mince';
    TEXT_WHOLL_START= 'Kdo začne?';
    TEXT_APPLY      = 'Použít';
    TEXT_BACK       = 'Zpět';
    TEXT_COIN1      = 'Hlava';
    TEXT_COIN2      = 'Orel';
    TEXT_SETTINGS   = 'Nastavení';
    TEXT_A_SETTINGS = 'Pokročilé';
    TEXT_LANG       = 'Jazyk';
    TEXT_TIMER      = 'Nezdržuj';
    TEXT_INIT_SCORE = 'Počáteční skóre';
    TEXT_INIT_SUBSCR= 'Počáteční subskóre';
    TEXT_USE_SUBSCR = 'Povolit subskóre';
    TEXT_USE_THROW_HISTORY = 'Povolit historii hodů';
    TEXT_USE_SCORE_HISTORY = 'Povolit historii skóre';
    TEXT_USE_TIME_TRACK = 'Povolit sledování času';
    TEXT_DICE_COUNT = 'Počet kostek';
    TEXT_PL_COUNT   = 'Počet hráčů';
    TEXT_PL_COLORS  = 'Barvy hráčů';
    TEXT_COUNTDOWN  = 'Odpočet';
}

'static'; function SetLanguageEnglish() {
    TEXT_WHO_STARTS = 'Chance';
    TEXT_THROW_DICE = 'Dice';
    TEXT_TOSS_COIN  = 'Coin';
    TEXT_WHOLL_START= 'Who\'ll start?';
    TEXT_APPLY      = 'Apply';
    TEXT_BACK       = 'Back';
    TEXT_COIN1      = 'Head';
    TEXT_COIN2      = 'Tail';
    TEXT_SETTINGS   = 'Settings';
    TEXT_A_SETTINGS = 'Advanced';
    TEXT_LANG       = 'Language';
    TEXT_TIMER      = 'Timer';
    TEXT_INIT_SCORE = 'Initial score';
    TEXT_INIT_SUBSCR= 'Initial subscore';
    TEXT_USE_SUBSCR = 'Enable subscore';
    TEXT_USE_THROW_HISTORY = 'Enable throw history';
    TEXT_USE_SCORE_HISTORY = 'Enable score history';
    TEXT_USE_TIME_TRACK = 'Enable time tracking';
    TEXT_DICE_COUNT = 'Dice count';
    TEXT_PL_COUNT   = 'Player count';
    TEXT_PL_COLORS  = 'Player colors';
    TEXT_COUNTDOWN  = 'Countdown';
}

'static'; function SetLanguageById(id) {
    [
        SetLanguageCzech,
        SetLanguageEnglish,
    ][id]();
    ClearOptimizationCache();
}