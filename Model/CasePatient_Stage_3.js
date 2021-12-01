const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const casePatientStage3Schema = new Schema({

    _ref_casepatinetid: { type: ObjectId, required: true, ref: 'l_casepatient' },

    create_date: { type: Date, required: true },
    create_date_string: { type: String, required: true },
    create_time_string: { type: String, required: true },

    modify_date: { type: Date, required: true },
    modify_date_string: { type: String, required: true },
    modify_time_string: { type: String, required: true },

    stage3data: {
        ortho: {
            type: {
                upper: {
                    type: {
                        bp: { type: String, default: null },
                        hr: { type: Number, default: null },
                        o2sat: { type: Number, default: null },
                        posture_group: [
                            { type: String }
                        ],
                        posture_other: { type: String, default: null },
                        redness_at: { type: String, default: null },
                        swelling_at: { type: String, default: null },
                        warmth_at: { type: String, default: null },
                        spasm_at: { type: String, default: null },
                        tender_point_at: { type: String, default: null },
                        trigger_point_at: { type: String, default: null },
                        referred_pain_at: { type: String, default: null },
                        crepitus_sound: { type: Boolean, default: false },
                        crepitus_at: { type: String, default: null },
                        observation_other: { type: String, default: null },
                        table_range_of_motion_right: [
                            {
                                id: { type: String, default: null },
                                name: { type: String, default: null },
                                active_rom: { type: Number, default: null },
                                pain_scale: { type: Number, default: null },
                                passive_rom: { type: Number, default: null },
                                pain_scale2: { type: Number, default: null },
                                endfeel: { type: String, default: null },
                                key: { type: Number, default: null },
                            }
                        ],
                        table_range_of_motion_left: [
                            {
                                id: { type: String, default: null },
                                name: { type: String, default: null },
                                active_rom: { type: Number, default: null },
                                pain_scale: { type: Number, default: null },
                                passive_rom: { type: Number, default: null },
                                pain_scale2: { type: Number, default: null },
                                endfeel: { type: String, default: null },
                                key: { type: Number, default: null },
                            }
                        ],
                        passive_accessory_movement: { type: String, default: null },
                        manual_muscle_test: { type: String, default: null },
                        isometric_test: { type: String, default: null },
                        muscle_length_test: { type: String, default: null },
                        hbn_rt: { type: Number, default: null },
                        hbn_lt: { type: Number, default: null },
                        hbb_rt: { type: Number, default: null },
                        hbb_lt: { type: Number, default: null },
                        functional_other: { type: String, default: null },
                        ulnt1: { type: String, default: null },
                        ulnt1_note: { type: String, default: null },
                        ulnt2: { type: String, default: null },
                        ulnt2_note: { type: String, default: null },
                        ulnt3a: { type: String, default: null },
                        ulnt3a_note: { type: String, default: null },
                        ulnt3b: { type: String, default: null },
                        ulnt3b_note: { type: String, default: null },
                        neurodynamic_ulnt1: { type: String, default: null },
                        capsular_length_test: [
                            {
                                name: { type: String, required: true },
                                right: { type: String, default: null },
                                left: { type: String, default: null },
                            },
                        ],
                        special_test: [
                            {
                                name: { type: String, required: true },
                                type: { type: Boolean, default: false },
                            }
                        ],
                        other: {
                            other_case: [
                                {
                                    name: { type: String, required: true },
                                }
                            ]
                        },
                        long_term_goal: { type: String, default: null },
                        short_term_goal: { type: String, default: null },
                        _ref_pt_diagnosisid: { type: ObjectId, required: true },
                        pt_diagnosis: { type: String, required: true }, /* Required */
                        pt_diagnosis_other: { type: String, default: null },
                    },

                    default: null
                },

                lower: {
                    type: {
                        bp: { type: String, default: null },
                        hr: { type: Number, default: null },
                        o2sat: { type: Number, default: null },
                        posture_group: [
                            { type: String }
                        ],
                        posture_other: { type: String, default: null },
                        redness_at: { type: String, default: null },
                        swelling_at: { type: String, default: null },
                        warmth_at: { type: String, default: null },
                        spasm_at: { type: String, default: null },
                        tender_point_at: { type: String, default: null },
                        trigger_point_at: { type: String, default: null },
                        referred_pain_at: { type: String, default: null },
                        crepitus_sound: { type: Boolean, default: null }, /* Boolean */
                        crepitus_at: { type: String, default: null },
                        observation_other: { type: String, default: null },
                        table_range_of_motion_right: [
                            {
                                id: { type: String, default: null },
                                name: { type: String, required: true },
                                active_rom: { type: Number, default: null },
                                pain_scale: { type: Number, default: null },
                                passive_rom: { type: Number, default: null },
                                pain_scale2: { type: Number, default: null },
                                endfeel: { type: String, default: null },
                                key: { type: Number, default: null },
                            }
                        ],
                        table_range_of_motion_left: [
                            {
                                id: { type: String, default: null },
                                name: { type: String, required: true },
                                active_rom: { type: Number, default: null },
                                pain_scale: { type: Number, default: null },
                                passive_rom: { type: Number, default: null },
                                pain_scale2: { type: Number, default: null },
                                endfeel: { type: String, default: null },
                                key: { type: Number, default: null },
                            }
                        ],
                        passive_accessory_movement: { type: String, default: null },
                        manual_muscle_test: { type: String, default: null },
                        isometric_test: { type: String, default: null },
                        muscle_length_test: { type: String, default: null },
                        squat: { type: String, default: null },
                        kneeling: { type: String, default: null },
                        lunges: { type: String, default: null },
                        jumping: { type: String, default: null },
                        jogging: { type: String, default: null },
                        high_knee: { type: String, default: null },
                        step_up_and_down: { type: String, default: null },
                        functional_test_other: { type: String, default: null },
                        ulnt1: { type: String, default: null },
                        ulnt1_note: { type: String, default: null },
                        ulnt2: { type: String, default: null },
                        ulnt2_note: { type: String, default: null },
                        ulnt3a: { type: String, default: null },
                        ulnt3a_note: { type: String, default: null },
                        ulnt3b: { type: String, default: null },
                        ulnt3b_note: { type: String, default: null },
                        neurodynamic_ulnt1: { type: String, default: null },
                        functional_other: { type: String, default: null },
                        capsular_length_test: [
                            {
                                name: { type: String, required: true },
                                right: { type: String, default: null },
                                left: { type: String, default: null },
                            }
                        ],
                        special_test: [
                            {
                                name: { type: String, required: true },
                                type: { type: Boolean, default: false },
                            }
                        ],
                        other: {
                            other_case: [
                                {
                                    name: { type: String, required: true },
                                }
                            ]
                        },
                        long_term_goal: { type: String, default: null },
                        short_team_goal: { type: String, default: null },
                        _ref_pt_diagnosisid: { type: ObjectId, required: true },
                        pt_diagnosis: { type: String, Required: true }, /* Required */
                        pt_diagnosis_other: { type: String, default: null },
                    },

                    default: null
                },

                trunk_spine: {
                    type: {
                        bp: { type: String, default: null },
                        hr: { type: Number, default: null },
                        o2sat: { type: Number, default: null },
                        posture_group: [
                            { type: String, Required: true },
                        ],
                        posture_other: { type: String, default: null },
                        redness_at: { type: String, default: null },
                        swelling_at: { type: String, default: null },
                        warmth_at: { type: String, default: null },
                        spasm_at: { type: String, default: null },
                        tender_point_at: { type: String, default: null },
                        trigger_point_at: { type: String, default: null },
                        referred_pain_at: { type: String, default: null },
                        crepitus_sound: { type: Boolean, required: true },
                        crepitus_at: { type: String, default: null },
                        observation_other: { type: String, default: null },
                        table_range_of_motion_right: [
                            {
                                id: { type: String, default: null },
                                name: { type: String, required: true },
                                active_rom: { type: Number, default: null },
                                pain_scale: { type: Number, default: null },
                                passive_rom: { type: Number, default: null },
                                pain_scale2: { type: Number, default: null },
                                endfeel: { type: String, default: null },
                                key: { type: Number, default: null },
                            }
                        ],
                        table_range_of_motion_left: [
                            {
                                id: { type: String, default: null },
                                name: { type: String, required: true },
                                active_rom: { type: Number, default: null },
                                pain_scale: { type: Number, default: null },
                                passive_rom: { type: Number, default: null },
                                pain_scale2: { type: Number, default: null },
                                endfeel: { type: String, default: null },
                                key: { type: Number, default: null },
                            }
                        ],
                        cervical_contralateral: { type: String, default: null },
                        cervical_ipsilateral: { type: String, default: null },
                        lumbar_contralateral: { type: String, default: null },
                        lumbar_ipsilateral: { type: String, default: null },
                        ppim: { type: String, default: null },
                        paiv: { type: String, default: null },
                        isometric_test: { type: String, default: null },
                        muscle_length_test: { type: String, default: null },
                        slr: { type: String, default: null },
                        slr_comment: { type: String, default: null },
                        slump_test: { type: String, default: null },
                        slump_test_comment: { type: String, default: null },
                        prone_knee_bending: { type: String, default: null },
                        prone_knee_bending_comment: { type: String, default: null },
                        sensory_right: [
                            {
                                name: { type: String, required: true },
                                pinprick: { type: String, default: null },
                                light_touch: { type: String, default: null },
                                action: { type: String, default: null },
                            }
                        ],
                        sensory_left: [
                            {
                                name: { type: String, required: true },
                                pinprick: { type: String, default: null },
                                light_touch: { type: String, default: null },
                                action: { type: String, default: null },
                            }
                        ],
                        deep_tendon_items: [
                            {
                                name: { type: String, required: true },
                                name_list: { type: String, required: true },
                                right: { type: String, default: null },
                                left: { type: String, default: null },
                            }
                        ],
                        special_test: [
                            {
                                name: { type: String, required: true },
                                type: { type: Boolean, default: false },
                            }
                        ],
                        other: {
                            other_case: [
                                {
                                    name: { type: String, required: true },
                                }
                            ]
                        },
                        long_term_goal: { type: String, default: null },
                        short_term_goal: { type: String, default: null },
                        _ref_pt_diagnosisid: { type: ObjectId, required: true },
                        pt_diagnosis: { type: String, required: true },
                        pt_diagnosis_other: { type: String, default: null },
                    },
                    default: null
                },

                general: {
                    type: {
                        bp: { type: String, default: null },
                        hr: { type: Number, default: null },
                        o2sat: { type: Number, default: null },
                        observation_palpation: { type: String, default: null },
                        table_range_of_motion_right: [
                            {
                                id: { type: String, default: null },
                                name: { type: String, required: true },
                                active_rom: { type: Number, default: null },
                                pain_scale: { type: Number, default: null },
                                passive_rom: { type: Number, default: null },
                                pain_scale2: { type: Number, default: null },
                                endfeel: { type: String, default: null },
                            }
                        ],
                        table_range_of_motion_left: [
                            {
                                id: { type: String, default: null },
                                name: { type: String, required: true },
                                active_rom: { type: Number, default: null },
                                pain_scale: { type: Number, default: null },
                                passive_rom: { type: Number, default: null },
                                pain_scale2: { type: Number, default: null },
                                endfeel: { type: String, default: null },
                            }
                        ],
                        passive_accessory_movement: { type: String, default: null },
                        manual_isometric_test: { type: String, default: null },
                        muscle_length_test: { type: String, default: null },
                        combined_functional_movement: { type: String, default: null },
                        sensory_test_right: [
                            {
                                name: { type: String, required: true },
                                left: { type: String, default: null },
                                right: { type: String, default: null },
                            }
                        ],
                        sensory_test_left: [
                            {
                                name: { type: String, required: true },
                                left: { type: String, default: null },
                                right: { type: String, default: null },
                            }
                        ],
                        brachioradialis_right: { type: String, default: null },
                        brachioradialis_left: { type: String, default: null },
                        biceps_right: { type: String, default: null },
                        biceps_left: { type: String, default: null },
                        triceps_right: { type: String, default: null },
                        triceps_left: { type: String, default: null },
                        patella_right: { type: String, default: null },
                        patella_left: { type: String, default: null },
                        achilles_right: { type: String, default: null },
                        achilles_left: { type: String, default: null },
                        neurodynamic_test: [
                            {
                                name: { type: String, required: true },
                                type: { type: Boolean, default: false },
                                note: { type: String, default: null },
                            }
                        ],
                        special_test: [
                            {
                                name: { type: String, required: true },
                                type: { type: Boolean, default: false },
                            }
                        ],
                        other: [
                            {
                                name: { type: String, required: true },
                            }
                        ],
                        long_term_goal: { type: String, default: null },
                        short_team_goal: { type: String, default: null },
                        _ref_pt_diagnosisid: { type: ObjectId, required: true },
                        pt_diagnosis: { type: String, required: true },
                        pt_diagnosis_other: { type: String, default: null },
                    },

                    default: null
                },
            }, default: null
        },
        neuro: {
            type: {
                bp: { type: String, default: null },
                hr: { type: Number, default: null },
                o2sat: { type: Number, default: null },
                consciousness: [
                    { type: String, required: true }
                ],
                gcs: { type: Number, default: null },
                gcsV: { type: Number, default: null },
                gcsM: { type: Number, default: null },
                bodybuilt: [
                    { type: String, required: true }
                ],
                bmi: { type: Number, default: null },
                ambulation: [
                    { type: String, required: true },
                ],
                vision: { type: String, default: null },
                visionright: { type: String, default: null },
                hearing: { type: String, default: null },
                hearingright: { type: String, default: null },
                neglect: { type: String, default: null },
                neglectright: { type: String, default: null },
                posture: [
                    { type: String, required: true }
                ],
                posture_comment: { type: String, default: null },
                chest_shape: [
                    { type: String, required: true }
                ],
                breathing: [
                    { type: String, required: true }
                ],
                breathing_other: { type: String, default: null },
                acessory: { type: String, default: null },
                acessory_comment: { type: String, default: null },
                skincolor: { type: String, default: null },
                clubbing: { type: String, default: null },
                peripheral: { type: String, default: null },
                lncisionline: { type: String, default: null },
                lncisionline_comment: { type: String, default: null },
                cough: { type: String, default: null },
                sputum: { type: String, default: null },
                sputum_color: { type: String, default: null },
                devices: [
                    { type: String, required: true }
                ],
                l_min: { type: String, default: null },
                devices_comment: { type: String, default: null },
                rom_active_right: { type: String, default: null },
                rom_active_left: { type: String, default: null },
                rom_passive_right: { type: String, default: null },
                rom_passive_left: { type: String, default: null },
                musclestrength_right: { type: String, default: null },
                musclestrength_left: { type: String, default: null },
                musclelength_right: { type: String, default: null },
                musclelength_left: { type: String, default: null },
                muscletone_right: { type: String, default: null },
                muscletone_left: { type: String, default: null },
                data_USE_rigth: {
                    lighttouch: { type: String, default: null },
                    light_comment: { type: String, default: null },
                    pinprick_RU: { type: String, default: null },
                    pinprick_comment_UR: { type: String, default: null },
                    proprioception_RU: { type: String, default: null },
                    proprioception_comment_RU: { type: String, default: null },
                    temperature: { type: String, default: null },
                    temperature_comment: { type: String, default: null }
                },
                data_Use_left: {
                    lighttouch_UL: { type: String, default: null },
                    light_comment_UL: { type: String, default: null },
                    pinprick_UL: { type: String, default: null },
                    pinprick_comment__UL: { type: String, default: null },
                    proprioception_UL: { type: String, default: null },
                    proprioception_comment_UL: { type: String, default: null },
                    temperature__UL: { type: String, default: null },
                    temperature_comment_UL: { type: String, default: null }
                },
                data_Les_right: {
                    lighttouch_LR: { type: String, default: null },
                    light_comment_LR: { type: String, default: null },
                    pinprick_LR: { type: String, default: null },
                    pinprick_comment_LR: { type: String, default: null },
                    proprioception_LR: { type: String, default: null },
                    proprioception_comment_LR: { type: String, default: null },
                    temperature_LR: { type: String, default: null },
                    temperature_comment_LR: { type: String, default: null }
                },
                data_Les_left: {
                    lighttouch_LL: { type: String, default: null },
                    light_comment_LL: { type: String, default: null },
                    pinprick_LL: { type: String, default: null },
                    pinprick_comment_LL: { type: String, default: null },
                    proprioception_LL: { type: String, default: null },
                    proprioception_comment_LL: { type: String, default: null },
                    temperature_LL: { type: String, default: null },
                    temperature_comment_LL: { type: String, default: null }
                },
                brachioradialis_left: { type: String, default: null },
                brachioradialis_right: { type: String, default: null },
                brachioradialis_comment: { type: String, default: null },
                biceps_left: { type: String, default: null },
                biceps_right: { type: String, default: null },
                biceps_comment: { type: String, default: null },
                triceps_left: { type: String, default: null },
                triceps_right: { type: String, default: null },
                triceps_comment: { type: String, default: null },
                patella_left: { type: String, default: null },
                patella_right: { type: String, default: null },
                patella_comment: { type: String, default: null },
                achilles_left: { type: String, default: null },
                achilles_right: { type: String, default: null },
                achilles_comment: { type: String, default: null },
                balance_sitting_top: { type: String, default: null },
                balance_sitting_top_comment: { type: String, default: null },
                balance_sitting_bottom: { type: String, default: null },
                balance_sitting_bottom_comment: { type: String, default: null },
                balance_standing_top: { type: String, default: null },
                balance_standing_top_comment: { type: String, default: null },
                balance_standing_bottom: { type: String, default: null },
                balance_standing_bottom_comment: { type: String, default: null },
                fingertonose_right: { type: String, default: null },
                fingertonose_left: { type: String, default: null },
                heeltoshin_right: { type: String, default: null },
                heeltoshin_left: { type: String, default: null },
                other_right: { type: String, default: null },
                other_left: { type: String, default: null },
                Functional_assessment_Right: [
                    {
                        name: { type: String, default: null },
                        FA_Right_Drop: { type: String, default: null },
                        comment: { type: String, default: null }
                    }
                ],
                Functional_assessment_Left: [
                    {
                        name: { type: String, default: null },
                        FA_Right_Drop: { type: String, default: null },
                        comment: { type: String, default: null }
                    }
                ],
                Functional_assessment: [
                    {
                        name: { type: String, default: null },
                        FA_Right_Drop: { type: String, default: null },
                        comment: { type: String, default: null }
                    }
                ],
                gaitanalysis: { type: String, default: null },
                specialtest: [
                    {
                        name: { type: String, default: null },
                        select: { type: String, default: null },
                        remark: { type: String, default: null }
                    }
                ],
                data_Palpation: {
                    dataUpper: {
                        Trachea: { type: String, default: null },
                        Symmetry_list: { type: String, default: null },
                        Commentmovement: { type: String, default: null },
                        Rightcm: { type: String, default: null },
                        Leftcm: { type: String, default: null },
                        commentexpansion: { type: String, default: null },
                        right: { type: String, default: null },
                        left: { type: String, default: null },
                        TractileComment_list: { type: String, default: null },
                        Expand: { type: String, default: null }
                    },
                    dataMiddle: {
                        Trachea_M: { type: String, default: null },
                        Symmetry_list_MD: { type: String, default: null },
                        Expand_M: { type: String, default: null },
                        Commentmovement_M: { type: String, default: null },
                        Rightcm_M: { type: String, default: null },
                        Leftcm_M: { type: String, default: null },
                        commentexpansion_M: { type: String, default: null },
                        right_M: { type: String, default: null },
                        left_M: { type: String, default: null },
                        TractileComment_list_M: { type: String, default: null }
                    },
                    dataLower: {
                        Trachea_L: { type: String, default: null },
                        Symmetry_list_L: { type: String, default: null },
                        Expand_L: { type: String, default: null },
                        Commentmovement_L: { type: String, default: null },
                        Rightcm_L: { type: String, default: null },
                        Leftcm_L: { type: String, default: null },
                        commentexpansion_L: { type: String, default: null },
                        right_L: { type: String, default: null },
                        left_L: { type: String, default: null },
                        TractileComment_list_L: { type: String, default: null }
                    }
                },
                dataPercussionnote: {
                    upper_right: { type: String, default: null },
                    upper_left: { type: String, default: null },
                    middle_right: { type: String, default: null },
                    middle_left: { type: String, default: null },
                    lower_right: { type: String, default: null },
                    lower_left: { type: String, default: null }
                },
                dataBreathsounds: {
                    upper_Breath_right: { type: String, default: null },
                    upper_Breath_left: { type: String, default: null },
                    middle_Breath_right: { type: String, default: null },
                    middle_Breath_left: { type: String, default: null },
                    lower_Breath_right: { type: String, default: null },
                    lower_Breath_left: { type: String, default: null }
                },
                dataGoal: {
                    longtermgoal: { type: String, default: null },
                    shorttermgoal: { type: String, default: null }
                },
                _ref_pt_diagnosisid: { type: ObjectId, required: true },
                pt_diagnosis: { type: String, required: true },
                pt_diagnosis_other: { type: String, default: null }

            }, default: null
        }
    },

}, { collection: 'l_casepatient_stage_3' });

casePatientStage3Schema.index({ '_ref_casepatinetid': 1 }, { unique: true }); // One Case - One Stage3

const casePatientStage3Model = mongooseConn.model("l_casepatient_stage_3", casePatientStage3Schema);

module.exports = casePatientStage3Model;