*****************
** Features    **
*****************

* Limit quantity of buildings that can be constructed
* Create "Blueprint" that can unlock new building copies. (Just use lock?)
* Create UI classes in engine to show blueprint slideout
* Add enemies that spawn gradually as things are unlocked.
* Make "Tower" lock far enough away that you need to get a blueprint first.
* Make boss?

*****************
** Bugs        **
*****************

* Sometimes enemies don't spawn after warning. Seems sporadic.
* When game is sleeping for a long time, it goes turbo speed.
* Tower range shouldn't show when menu is on top of them and they are hovered

*****************
** Misc        **
*****************

* Make a nicer way to express building being clicked on in event.
* Add animations to engine and animate conveyor
* Dragging belt into a building to direct it in looks a little buggy.
* Librarify the engine
* Better handling for fullscreen. Resize canvas. Fix mouse drag ratios. Allow smaller windows.
* Make ScoreBoard generic
* Fans get loud when I zoom out. Tileset should probably store static version of game field.
* Clean up belt corner logic
* Remove event handlers when object that created them is removed.
* Resource rotation wont track skipping building rotations. Ex. rotating building from right to left position

*****************
** Performance **
*****************

* Creating new Coords hundreds of times per sec. Creating camera bounding recs hundreds of times per second