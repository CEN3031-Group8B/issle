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
* Drag Drop List Schema
*/
var dragListSchema = new Schema({
	benchmark: String,
	default: ''
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
	projAdmin:{
		type: [Schema.ObjectId],
	},
	remixCount: {
 		type: Number,
 		default: 0
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
	askStandardStep: [dragListSchema],
	ask: {
		/*goal: {
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
		},*/
		//FOR NEW SCHEMA
		learningObjective: {
			type: String,
			default: ''
		},
		Constraints: {
			type: String,
			default: ''
		},
		//standardStep: [dragListSchema]
	},
	//FOR NEW SCHEMA
	researchStandardStep: [dragListSchema],
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
	imagineStandardStep: [dragListSchema],
	imagine: {
		/*brainstorm: {
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
		},*/
		//FOR NEW SCHEMA
		listStep: {
			type: String,
			default: ''
		}
	},
	//FOR NEW SCHEMA
	planStandardStep: [dragListSchema],
	plan: {
		selectStep: {
			type: String,
			default: ''
		},
		resources: {
			type: String,
			default: ''
		}
	},
	//FOR NEW SCHEMA
	createStandardStep: [dragListSchema],
	createStep:{
		buildStep:{
			type: String,
			default: ''
		}
	},
	//FOR NEW SCHEMA
	testStandardStep: [dragListSchema],
	testStep:{
		designStep: {
			type: String,
			default: ''
		},
		successStep:{
			type: String,
			default: ''
		}
	},
	//FOR NEW SCHEMA
	improveStandardStep: [dragListSchema],
	improveStep:{
		changeStep: {
			type: String,
			default: ''
		}
	},
	worksheetStep:{
		theWorksheet: {
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
