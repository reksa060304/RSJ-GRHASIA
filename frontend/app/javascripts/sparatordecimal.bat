@ECHO OFF
SET registreChemin=HKEY_CURRENT_USER\Control Panel\International
SET registreCle=sDecimal
SET registreType=REG_SZ
SET registreValeurVirgule=,
SET registreValeurPoint=.
REG QUERY "%registreChemin%" /v "%registreCle%" | FIND "%registreValeurPoint%"


REG ADD "HKEY_CURRENT_USER\Control Panel\International" /f /v "sDecimal" /t %registreType% /d "%registreValeurPoint%"
CLS
ECHO Separateur decimal "."
GOTO END
