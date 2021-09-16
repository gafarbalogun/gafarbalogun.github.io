whenSetup(function () {
  setBackgroundEffectWithPalette("squiggles", "neon");
  makeNewDanceSpriteGroup(16, "ROBOT", "border");
  makeAnonymousDanceSprite("UNICORN", {x: 200, y: 200});
});

everySeconds(2, "measures", function () {
  setBackgroundEffectWithPalette("rand", "rave");
  changeMoveEachLR(sprites, "rand", -1);
});
