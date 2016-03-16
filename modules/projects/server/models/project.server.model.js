'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var SubjectSchema = new Schema({
	subjectName: {
		type: String,
		default: ''
	},
	mainIdea: {
		type: String,
		default: ''
	},
	standards: {
		type: String, //Should be a list of standards in the future
		default: ''
	},
	details: {
		type: String,
		default: ''
	}
});

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Project name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	minGrade: {
		type: Number,
		default: 0
	},
	maxGrade: {
		type: Number,
		default: 12
	},
	status: {
		type: String,
		enum: ['Active', 'In Progress', 'InActive'],
		default: 'In Progress'
	},
	isPublic: {
		type: Boolean,
		default: false
	},
	rating: {
		ratings: [
			{
				num: {
					type: Number,	//number of stars
				},		
				reviewer: {
					type: Schema.ObjectId,	//ID of the user who rated it
					ref: 'User'
				}
			}
		],

		avg_rating: {
			//Recalculated from the ratings array every time a rating is submitted
			type: Number
		}
	},
	ask: {
		goal: {
			type: String,
			default: ''
		},
		problemStatement: {
			type: String,
			default: ''
		},
		solvingProblem: {
			type: String,
			default: ''
		},
		constraints: {
			type: String,
			default: ''
		},
		//FOR NEW SCHEMA
		learningObjective: {
			type: String,
			default: ''
		},
		Constraints: {
			type: String,
			default: ''
		}
	},
	//FOR NEW SCHEMA
	research: {
		focus: {
			type: String,
			default: ''
		},
		resources: {
			type: String,
			default: ''
		}
	},
	imagine: {
		brainstorm: {
			type: String,
			default: ''
		},
		plan: {
			type: String,
			default: ''
		},
		materials: {
			type: String,
			default: ''
		},
		//FOR NEW SCHEMA
		list: {
			type: String,
			default: ''
		}
	},
	//FOR NEW SCHEMA
	plan: {
		select: {
			type: String,
			default: ''
		},
		resources: {
			type: String,
			default: ''
		}
	},
	//FOR NEW SCHEMA
	createStep:{
		build:{
			type: String,
			default: ''
		}
	},
	//FOR NEW SCHEMA
	testStep:{
		design: {
			type: String,
			default: ''
		},
		success:{
			type: String,
			default: ''
		}
	},
	//FOR NEW SCHEMA
	improve:{
		change: {
			type: String,
			default: ''
		}
	},
	essentialDetails: {
		mathDetails: {
			type: [SubjectSchema]
		},
		scienceDetails: {
			type: [SubjectSchema]
		},
		litDetails: {
			type: [SubjectSchema]
		},
		ssDetails: {
			type: [SubjectSchema]
		},
		overallStandards: {
		type: String, //Should be a list of standards in the future
		default: ''
		},
		overallSubjects: {
		type: String, 
		default: ''
		},
		otherSubject:{
			type: [SubjectSchema]
		},
		communicateFindings: {
			type: String,
			default: ''
		}
	}
});


mongoose.model('Project', ProjectSchema);
