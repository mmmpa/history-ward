window.HistoryWard = class HistoryWard
	@PUSHSTATE = 'pushstate'
	@FORWARD = 'popstate:forward'
	@BACKWARD = 'popstate:backword'
	@one = null

	@start: (isBrutal)->
		return HistoryWard.one if HistoryWard.one
		HistoryWard.one = new HistoryWard(isBrutal)

	@startBrutally: ->
		HistoryWard.start(true)
		History.prototype.pushStatePure = History.prototype.pushState
		History.prototype.pushState = (args...)->
			HistoryWard.one.pushState(args...)

	constructor: (@isBrutal)->
		@uid = 0
		@position = 0

		window.addEventListener('popstate', @onPopState)

	clean: (e)->
		#delete e.state.historyWardUID
		e

	dispatch: (name, e)->
		window.dispatchEvent(new e.constructor(name, @clean(e)))

	isBackward: (e)->
		return true unless e.state?.historyWardUID?
		e.state.historyWardUID < @position

	onPopState: (e)=>
		e.preventDefault()

		if @isBackward(e)
			@dispatch(HistoryWard.BACKWARD, e)
		else
			@dispatch(HistoryWard.FORWARD, e)

		@shift(e)

	pushState: (state = {}, title, url)->
		state.historyWardUID = @position = @uid += 1
		if @isBrutal
			history.pushStatePure(state, title, url)
		else
			history.pushState(state, title, url)

		window.dispatchEvent(new CustomEvent(HistoryWard.PUSHSTATE, detail: {
			state: state
			title: title
			url: url
			}))

	resume: ->
		window.addEventListener('popstate', @onPopState)

	shift: (e)->
		@position = if e.state?.historyWardUID?
			e.state.historyWardUID
		else
			0

	stop: ->
		window.removeEventListener('popstate', @onPopState)
