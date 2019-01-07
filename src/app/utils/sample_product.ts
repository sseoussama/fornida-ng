
//                        /$$
//                       | $$
//   /$$$$$$$  /$$$$$$  /$$$$$$   /$$$$$$$
//  /$$_____/ /$$__  $$|_  $$_/  /$$_____/
// |  $$$$$$ | $$$$$$$$  | $$   |  $$$$$$
//  \____  $$| $$_____/  | $$ /$$\____  $$
//  /$$$$$$$/|  $$$$$$$  |  $$$$//$$$$$$$/
// |_______/  \_______/   \___/ |_______/
export const sets = [
	{
		'name': 'Processors',
		'slug': 'processors',
		'options': [
			{
				'part': 'processors_912101',
				'name': '2x Intel Xeon Six-Core CPU E5-2630V2 15M Cache 2.6GHz 7.2 GT/s Intel QPI - SR1AM (24-DIMM capacity)',
				'add': 100.00
			}, {
				'part': 'processors_912102',
				'name': '2x Intel Xeon CPU Eight-Core E5-2640 v2 2.00GHz 20MB Cache - SR19Z (24-DIMM capacity)',
			}, {
				'part': 'processors_912103',
				'name': '2x Intel Xeon CPU 10-Core E5-2660 v2 (2.2GHz, 25M, 8.0GT/s) - SR1AB (24-DIMM capacity)',
			}, {
				'part': 'processors_912104',
				'name': '2x Intel Xeon 10-Core CPU E5-2670 v2 (2.5GHz, 25M, 8.00GT/s)- SR1A7 (20-DIMM capacity)',
				'add': 95.00
			}
		]
	}, {
		'name': 'Memory',
		'slug': 'memory',
		'options': [
			{
				'part': 'memory_912101',
				'name': '1GB PC-10600E Single Ranked DDR3 1333mhz Unbuffered ECC UDIMM Memory (1x 1GB)',
				'add': 100.00
			}, {
				'part': 'memory_912102',
				'name': '2GB PC-10600R Dual Ranked DDR3 1333mhz Registered RDIMM Memory (1x 2GB)'
			}, {
				'part': 'memory_912103',
				'name': '4GB PC-12800R Dual Ranked DDR3 1600mhz Memory (1x 4GB)',
				'add': 43.20
			}
		]
	}, {
		'name': 'Chassis',
		'slug': 'chassis',
		'options': [
			{
				'part': 'chassis_912101',
				'name': '1 x Dell PowerEdge M620 SAS Blade Server Chassis w/STI Limited Warranty'
			}
		]
	}, {
		'name': 'Hard Drives',
		'slug': 'hardrives',
		'options': [
			{
				'part': 'hardrives_912101',
				'name': '300GB 10K RPM SAS 12Gbps 2.5\' Hard Drive w/Sled',
				'add': 100.00
			}, {
				'part': 'hardrives_912102',
				'name': '300GB 15K RPM SAS 6Gbps 2.5\' Hard Drive w/Sled',
			}, {
				'part': 'hardrives_912103',
				'name': '1TB 7.2K RPM Nearline SAS 6Gbps 2.5\' Hard Drive w/Sled',
				'add': 51.00
			}
		]
	}, {
		'name': 'Raid',
		'slug': 'raid',
		'options': [
			{
				'part': 'raid_912101',
				'name': 'PERC H310 Integrated RAID Controller',
				'add': 100.00
			}, {
				'part': 'raid_912102',
				'name': 'PERC H310 Integrated RAID Controller',
			}, {
				'part': 'raid_912103',
				'name': 'PERC H310 Integrated RAID Controller',
				'add': 23.20
			}
		]
	}
];


//                      /$$
//                     |__/
//   /$$$$$$   /$$$$$$  /$$  /$$$$$$$  /$$$$$$
//  /$$__  $$ /$$__  $$| $$ /$$_____/ /$$__  $$
// | $$  \ $$| $$  \__/| $$| $$      | $$$$$$$$
// | $$  | $$| $$      | $$| $$      | $$_____/
// | $$$$$$$/| $$      | $$|  $$$$$$$|  $$$$$$$
// | $$____/ |__/      |__/ \_______/ \_______/
// | $$
// | $$
// |__/
export const price = {
	base:450,
	additions:0,
	total:0
}





//   /$$$$$$$  /$$$$$$   /$$$$$$   /$$$$$$$  /$$$$$$$
//  /$$_____/ /$$__  $$ /$$__  $$ /$$_____/ /$$_____/
// |  $$$$$$ | $$  \ $$| $$$$$$$$| $$      |  $$$$$$
//  \____  $$| $$  | $$| $$_____/| $$       \____  $$
//  /$$$$$$$/| $$$$$$$/|  $$$$$$$|  $$$$$$$ /$$$$$$$/
// |_______/ | $$____/  \_______/ \_______/|_______/
//           | $$
//           | $$
//           |__/
export const specs = [
		{
			'name': 'Performance Specifications',
			'values': [
				{
					'key': 'Chromecast™ Built-in',
					'value': 'Yes'
				}, {
					'key': 'Multi-room Capability',
					'value': 'Yes'
				}, {
					'key': 'Speaker Configuration',
					'value': '2 x 2” full range | 2 x 5.25” subwoofer'
				}, {
					'key': 'Speaker Frequency',
					'value': '40 Hz – 20kHz'
				}, {
					'key': 'Touch Pad Control',
					'value': 'Play/Pause, Skip Track'
				}, {
					'key': 'Volume Dial',
					'value': 'Volume Up/Down'
				}, {
					'key': 'Sound Enhancement Technology',
					'value': 'DTS Studio Sound™, DTS TruVolume™'
				}
			]
		}, {
			'name': 'Energy Savings',
			'values': [
				{
					'key': 'Energy Compliance',
					'value': 'Energy Star 3.0'
				}, {
					'key': 'Standby Power Consumption',
					'value': '5W'
				}
			]
		}, {
			'name': 'Input',
			'values': [
				{
					'key': 'Power',
					'value': '100-240V AC power'
				}, {
					'key': 'Wi-Fi Input',
					'value': 'WiFi (C4A)'
				}, {
					'key': 'Ethernet Input',
					'value': '1'
				}, {
					'key': 'Bluetooth® Input',
					'value': 'BLE 4.1 Low Energy'
				}, {
					'key': 'USB Input',
					'value': '1'
				}
			]
		}
	];




                      
//   /$$$$$$   /$$$$$$   /$$$$$$
//  /$$__  $$ /$$__  $$ /$$__  $$
// | $$  \ $$| $$  \__/| $$$$$$$$
// | $$  | $$| $$      | $$_____/
// | $$$$$$$/| $$      |  $$$$$$$
// | $$____/ |__/       \_______/
// | $$
// | $$
// |__/
export const pre_configs = [
	{
		'name': 'set1',
		'desc': 'A short Description of this pre-config',
		'values': [
			{'part': 'processors_912101'},
			{'part': 'processors_912102'},
			{'part': 'processors_912103'}
		]
	}, {
		'name': 'set2',
		'desc': 'A short Description of this pre-config',
		'values': [
			{'part': 'processors_912104'},
			{'part': 'processors_912103'}
		]
	}, {
		'name': 'Test Pre-Config',
		'desc': 'A short Description of this pre-config',
		'values': [
			{'part': 'SLCTBS'}
		]
	}
];





export const Sample = {
	name: 'HPE PROLIANT SERVERS',
	slug: 'hpe_proliant_server',
	specs:specs,
	sets:sets,
	pre_configs:pre_configs,
	price:price
};





