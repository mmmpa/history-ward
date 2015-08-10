HistoryWard.startBrutally()

window.addEventListener(HistoryWard.PUSHSTATE, (e)->
	console.log e
	display.innerHTML = 'pushState: ' + write(e.detail)
	)

window.addEventListener(HistoryWard.BACKWARD, (e)->
	console.log e
	display.innerHTML = 'backward: ' + write(e.state)
	)

window.addEventListener(HistoryWard.FORWARD, (e)->
	console.log e
	display.innerHTML = 'forward: ' + write(e.state)
	)




for node in document.querySelectorAll('a')
	node.addEventListener('click', (e)->
		a = e.target
		e.preventDefault()
		history.pushState({param: a.innerHTML}, 'title', a.href)
		)

write = (obj)->
	(for key, value of obj
		[key, value].join(' = ')
	).join(', ')

display = document.querySelector('#state')
