var NotesIndexController = Composer.Controller.extend({
	elements: {
		'> .notes': 'note_list'
	},

	board: null,
	board_id: null,

	init: function()
	{
		if(this.board_id == 'all')
		{
			var title = 'All notes';
			var back = undefined;
		}
		else
		{
			this.board = turtl.profile.get('boards').find_by_id(this.board_id);
			if(!this.board)
			{
				barfr.barf('Hmm, that board doesn\'t seem to exist');
				log.error('notes: index: bad board id: ', this.board_id);
				window.history.go(-1);
			}
			var parent_id = this.board.get('parent_id');
			var parent = turtl.profile.get('boards').find_by_id(parent_id);
			var title = this.board.get('title');
			if(parent)
			{
				title = parent.get('title') + '/' + title;
			}
			var back = '/boards';
		}

		turtl.push_title(title, back);
		this.bind('release', turtl.pop_title.bind(null, false));

		this.render();

		turtl.events.trigger('actions:update', [
			{title: 'Add a note', name: 'add'}
		]);
		this.with_bind(turtl.events, 'actions:fire', function(action) {
			switch(action)
			{
				case 'add': this.open_add(); break;
			}
		}.bind(this));
	},

	render: function()
	{
		this.html(view.render('notes/index', {}));
		this.track_subcontroller('list', function() {
			return new NotesListController({
				inject: this.note_list,
				search: {
					boards: (this.board ? [this.board.id()] : [])
				}
			});
		}.bind(this));
	},

	open_add: function()
	{
		new NotesEditController();
	}
});

