module.exports = {
	port: 8080,
	title: "Mapper",
	groups: [
		{
			id: 1,
			name: 'Groep 1',
			students: [
				{
					first_name: 'Bram',
					last_name: 'Bogaerts',
					slug: 'bram-bogaerts',
					objects: [
						{
							x: 0.5,
							y: 0.5,
							images: [
								{
									fileName: 'img1.png'
								},
								
								{
									fileName: 'img2.png'
								},

								{
									fileName: 'img3.png'
								}
							]
						},

						{
							images: [
								{
									fileName: 'img1.png'
								},
								
								{
									fileName: 'img2.png'
								},

								{
									fileName: 'img3.png'
								}
							]
						},
					],
					keyframes: [
						{
							id: 1,
							time: 0
						},

						{
							id: 2,
							time: 0.3
						},

						{
							id: 3,
							time: 0.6
						}
					]
				},

				{
					first_name: 'Thomas',
					last_name: 'Boland',
					slug: 'thomas-boland'
				}
			]
		},

		{
			id: 2,
			name: 'Groep 2',
			students: [
				{
					first_name: 'Peter',
					last_name: 'Pan',
					slug: 'peter-pan'
				},

				{
					first_name: 'Kapitein',
					last_name: 'Haak',
					slug: 'kapitein-haak'
				}
			]
		},
	]
};
