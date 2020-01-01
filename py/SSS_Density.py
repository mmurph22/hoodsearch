# Name: Mike Murphy
# Date: 31 JAN 2018
# Purpose: To exercise the use of geometry objects: PartII program as GP Tool
#imports
import os
import arcpy
import json
import random

from arcgis.gis import GIS
from arcgis.gis import GIS
import arcgis.features
from arcgis.features import FeatureLayer
from arcgis.features import FeatureSet

#Globals
LOCAL_GDB = r"D:\UMD\GEOG797\Project\Capstone\Capstone.gdb"
LOCAL_STATIC = r"ParcelPt_Static"
LOCAL_SURVEY = r"https://services5.arcgis.com/njRHYVhl2CMXMsap/arcgis/rest/services/service_9eb8e96e758340a59c7630dd2f166af1/FeatureServer"
LOCAL_SCN = "{b9667126-f170-47d2-855e-4ff216d3e6e7}"
#LOCAL_SCN = "{8e5b16e5-8f58-4406-8665-ee3ed0a6ffe7}"
LOCAL_RESULTS = r"Suitability_Results"

UID_PARCELCOL = "ACCTID"  #unique id col for parcels
UID_SURVEYCOL = "GlobalID" #unique id col for surveys
UID_SURVEYSUBCOL = "ParentGlobalID" #unique id col for surveys

RESULTS_TABLEDEF = ["OID@", "SHAPE@","Scenario","ACCTID","FilterOut",
        "TSS","SSS_Price","SSS_SchoolE","SSS_SchoolM","SSS_SchoolH",
        "SSS_Commute","SSS_Density","SSS_Shop","SSS_ParksRec","SSS_Utilities"]
PARCELS_TABLEDEF = ["SHAPE@", UID_PARCELCOL, "TAG", "LU", "evalue_2015", "evalue_2019", 
        "SC_SCELEM", "SC_SCMID", "SC_SCHIGH", 
        "NEAR_Dist_Parks", "NEAR_Dist_ShopZoneD", "DIST_UTIL", "FilterOut"]
        #consider: Near_DIST_RecPublic, Near_Dist_Trails, NEAR_ShopZoneGen, (revisit utilities)

STOPPOINT = 99000
CUTRATIO = 25
TSS_WEIGHT = 10.0
PRICE_LOW_PERC_DEF = 0.50
PRICE_LOW_SCORE_DEF = 0.2
PRICE_HIGH_PERC_DEF = 0.25
PRICE_HIGH_SCORE_DEF = 0.2
SCORE_GOAL_DEF = 1.0
TOL = 1e-8
NO_DATA = -1e16

results_scores = ["SSS_Price","SSS_SchoolE","SSS_SchoolM","SSS_SchoolH", 
                    "SSS_Commute","SSS_Density","SSS_Shop","SSS_ParksRec","SSS_Utilities", "TSS"]

# density codes: [density_lu]=LU, [density_tag]=TAG [choice_denisty]=survey choice (pop_density)
density_survey = ["nonresidential", "rural", "subrural", "village", "suburban", "subintown", "intown", "urban"]
density_lu = ["A","C","CC","CR","E","EC","I","M","R","RC","U"] 
density_tag = ["AG","B1","B2","B3","CI","GI","LI","MO","R1","R2","R3","R4","RO","ROW","RR","RR*","TOWNS","VB","VR"]

# school data
school_type_ages = [[PARCELS_TABLEDEF[6],5,11], [PARCELS_TABLEDEF[7],11,14], [PARCELS_TABLEDEF[8],14,18]]

#proximity survey and thresholds: [0]=proximity type;[1]=score for survey match
prox_survey_th = [[PARCELS_TABLEDEF[9],"prox_parks",0.8], [PARCELS_TABLEDEF[10],"prox_shop",0.8], [PARCELS_TABLEDEF[11],"prox_util",0.5]]
#proximity definition [0]=survey option [1]=distance in meters
prox_distances = [["local",0.0], ["walk",400.0], ["one_mile",1609.3], ["three_mile",4828.0], ["area",6000.0], ["far",12000.0], ["remote",20000.0]]

    #Get user survey selection: surveyVal = [scenarioID, pop_density]
    # SELECT * from sruveydata where GlobalId = scenarioId
    #whereClause = "\"GlobalID\" = '" + scenarioid + "'"
    #uservalue = "" #init
    # If no rows match query, raise exception
    #sCur = arcpy.SearchCursor(surveydata, whereClause)
    #sRow = sCur.next()
    #if (sRow == None):
    #    del sRow
    #   del sCur
    #    raise NoRowsException(outfile)
    #else:
        
    #    userValue = sRow.getValue("pop_density")

    #Zeroize results, see above
    #Get user survey selection: surveyval = [scenarioID, pop_density]
    #Create scoring for all Static datatypes: typescore = (TAG, surveyval)
    #Get the static data. For each parcel...
        # Derive a [Density score]: parcelscore = (TAG, typescore)
        # In Static Data, get parcel UID (OBJECTID or ACCTID)
        # In Results Data, get matching row with parcel UID
        # Copy [Density Score] to Results.SSS_Density
    #Done
def funwithsurveydata(surveydata, scenarioid):
    print (type(surveydata))
    print (surveydata[0])
    print (surveydata[0].geometry['x'])
    xval = surveydata[0].geometry['x']
    print (type(xval))
    print (surveydata[0].attributes['pricet_high'])
    print ("...")
    print (surveydata[1])
    print ("...")
    print (surveydata[1][2].attributes['res_age'])
    pgid = "{" + surveydata[1][2].attributes['parentglobalid'] + "}"
    print (pgid)
    print (scenarioid)
    if (pgid == scenarioid):
        print ("...We're in sync")
    else:
        print ("...missed on guid")

def funwithresultsdata(parcelscores, scenarioid):
    #print (parcelscores)
    for sc in parcelscores:
        print (sc[0] + ":TSS=" + str(getResultsValueByParcelScore(sc, "TSS")))
        #print (sc[0])
        #for v in sc[1]:
            #print( v[0]+"="+str(v[1])+"W"+str(v[2]) )
    
# standardize text output
#in: formatted text to print, message type code
#out: none
def printArcOut(msg, errCode):
    print (msg)
    # to skip posting, pass errCode<0
    if (errCode == 1):
        arcpy.AddWarning(msg)
    elif (errCode == 2):
        arcpy.AddError(msg)
    elif (errCode == 0):
        arcpy.AddMessage(msg)

# in: row counter, value of row
# out: none
def printListVal(count, value):
    msg = "%d) %s" % (count, value)
    printArcOut(msg,0)
    
# standardize general exception output
# in: Exception object
# out: none
def printException(e):
    print ("Error: " + str(e)) # Prints Python-related errors
    #print arcpy.GetMessages() # Prints ArcPy-related errors
    arcpy.AddError(e) # Adds errors to ArcGIS custom tool


#getting parcel sscore
def getResultsByParcel(parcelscores, acctid):
    for ps in parcelscores:
        if (ps[0] == acctid):
            return ps[1]
    return None #not found

def getResultsValueOfScore(score):
    if (score):
        return score[1]
    return None #not found

def getResultsValueByTypeOfScore(scores, suit_type):
    if (scores):
        for sc in scores:
            if (sc[0] == suit_type):
                return getResultsValueOfScore(sc)
    return None #not found

def getResultsValueByParcelScore(parcelscore, suit_type):
    return getResultsValueByTypeOfScore(parcelscore[1], suit_type)

def getResultsValueByParcel(parcelscores, acctid, suit_type):
    if (parcelscores):
        for ps in parcelscores:
            if (ps[0] == acctid):
                return getResultsValueByParcelScore(ps, suit_type)
    return None #not found

# Writing scores to data table
def writeParcelScoresToResults(staticdata, resultsdata, scenarioid, parcelscores):

    # Static Data Search Cursor
    stSCursor = arcpy.da.SearchCursor(staticdata, PARCELS_TABLEDEF)
    ctr = 0

    # Results Data Insert Cursor
    resICursor = arcpy.da.InsertCursor(resultsdata, RESULTS_TABLEDEF)

    for stRow in stSCursor:
        #filter by cut ratio
        if ((ctr % CUTRATIO) > 0):
            ctr = ctr + 1
            continue

        ctrmsg = "%d" % ctr
        
        # static row data
        pt = arcpy.Point()
        pt.clone(stRow[0].centroid)

        PID = stRow[1]
        #filter out: if non-residential, remove
        filterout = stRow[len(stRow)-1]
        #landcode = getSurveyDensityCodes(stRow[3], stRow[2])
        #if (landcode == density_survey[0]):
        #    filterout = 1.0
        #else:
        #    filterout = stRow[len(stRow)-1]
        
        #score to set
        #results_scores = ["SSS_Price","SSS_SchoolE","SSS_SchoolM","SSS_SchoolH", 
        #            "SSS_Commute","SSS_Density","SSS_Shop","SSS_ParksRec","SSS_Utilities", "TSS"]
        scores = getResultsByParcel(parcelscores, PID)
        price = getResultsValueByTypeOfScore(scores, results_scores[0])
        sche = getResultsValueByTypeOfScore(scores, results_scores[1])
        schm = getResultsValueByTypeOfScore(scores, results_scores[2])
        schh = getResultsValueByTypeOfScore(scores, results_scores[3])
        comm = getResultsValueByTypeOfScore(scores, results_scores[4])
        dens = getResultsValueByTypeOfScore(scores, results_scores[5])
        shop = getResultsValueByTypeOfScore(scores, results_scores[6])
        park = getResultsValueByTypeOfScore(scores, results_scores[7])
        util = getResultsValueByTypeOfScore(scores, results_scores[8])
        tss = getResultsValueByTypeOfScore(scores, results_scores[len(results_scores)-1])

        if (doesRowExist(resultsdata, PID) == False):
            if (DEQ(filterout, 0.0)):
                resICursor.insertRow([ctr, pt, scenarioid, PID, filterout,
                    tss, price, sche, schm, schh,
                    comm, dens, shop, park, util])
                printArcOut("New Row " + PID + " in Results..."+ctrmsg,-1)

        else: 
            whereClause = "\"" + UID_PARCELCOL + "\" = \'" + PID + "\'"
            with arcpy.da.UpdateCursor(resultsdata, RESULTS_TABLEDEF, where_clause=whereClause) as resUCursor:
                for resRow in resUCursor:
                    if (DEQ(filterout, 0.0)):
                        resRow[1] = pt
                        resRow[4] = filterout 
                        resRow[5] = tss #TSS
                        resRow[6] = price #SSS
                        resRow[7] = sche #SSS
                        resRow[8] = schm #SSS
                        resRow[9] = schh #SSS
                        resRow[10] = comm #SSS
                        resRow[11] = dens #SSS_Density
                        resRow[12] = shop #SSS
                        resRow[13] = park #SSS
                        resRow[14] = util #TSS
                        resUCursor.updateRow(resRow)
                        printArcOut("Updated Row " + PID + " in Results..."+ctrmsg,-1)

        if (ctr > STOPPOINT):
            del stSCursor
            del resICursor
            return
        ctr = ctr + 1

    del stSCursor
    del resICursor
    printArcOut("Wrote Results Data...",-1)   

# ZeroizeResults(statcdata, resultsdata)
# Get Cursor to Results Data
# Get the static data. For each parcel...
    # In Static Data, get parcel UID (OBJECTID or ACCTID)
    # Match Static UID to a Results UID
    # if Results UID does not match
        # Create a new row in Results ID
        # Copy Static.Shape to Results.Geometry
        # Copy Static.FilterOut to Results.FilterOut
        # Copy scenarioID to Results.Scenario
        # Set TSS, all SSS_* = 0
    # else 
        # Set Results.SSS_Density = 0
def zeroizeResults(staticdata, resultsdata, scenarioid):
    # Static Data Search Cursor
    stSCursor = arcpy.da.SearchCursor(staticdata, PARCELS_TABLEDEF)
    ctr = 0

    # Results Data Insert Cursor
    resICursor = arcpy.da.InsertCursor(resultsdata, RESULTS_TABLEDEF)

    for stRow in stSCursor:
        #filter by cut ratio
        if ((ctr % CUTRATIO) > 0):
            ctr = ctr + 1
            continue

        ctrmsg = "%d" % ctr
        
        # static row data
        pt = arcpy.Point()
        pt.clone(stRow[0].centroid)

        PID = stRow[1]
        filterout = stRow[len(stRow)-1]
        #printArcOut("Parcel:" + PID + "X[" + str(pt.X) + "]Y[" + str(pt.Y) + "]",-1)

        if (doesRowExist(resultsdata, PID) == False):
            resICursor.insertRow([ctr, pt, scenarioid, PID, filterout,
                0, 0, 0 ,0, 0,
                0, 0, 0, 0, 0])

            printArcOut("New Row " + PID + " in Results..."+ctrmsg,-1)

        else: 
            whereClause = "\"" + UID_PARCELCOL + "\" = \'" + PID + "\'"
            with arcpy.da.UpdateCursor(resultsdata, RESULTS_TABLEDEF, where_clause=whereClause) as resUCursor:
                for resRow in resUCursor:
                    
                    resRow[1] = pt
                    resRow[4] = 0.0 
                    resRow[5] = random.uniform(0.0, 10.0) #TSS
                    resRow[6] = random.uniform(0.0, 1.0) #SSS
                    resRow[7] = random.uniform(0.0, 1.0) #SSS
                    resRow[8] = random.uniform(0.0, 1.0) #SSS
                    resRow[9] = random.uniform(0.0, 1.0) #SSS
                    resRow[10] = random.uniform(0.0, 1.0) #SSS
                    resRow[11] = random.uniform(0.0, 1.0) #SSS_Density
                    resRow[12] = random.uniform(0.0, 1.0) #SSS
                    resRow[13] = random.uniform(0.0, 1.0) #SSS
                    resRow[14] = random.uniform(0.0, 1.0) #TSS
                    resUCursor.updateRow(resRow)
            printArcOut("Updated Row " + PID + " in Results..."+ctrmsg,-1)

        if (ctr > STOPPOINT):
            del stSCursor
            del resICursor
            return
        ctr = ctr + 1

    del stSCursor
    del resICursor
    printArcOut("Zeroized Results Data...",-1)

def doesRowExist(indataset, uid):
   #whereClause = "\"" + UID_PARCELCOL + "\" = '" + uid + "'"
   with arcpy.da.SearchCursor(indataset, [UID_PARCELCOL, 'SHAPE@']) as cursor:
       for row in cursor:
           if (row[0] == uid):
               return True
   
   return False


#creates statistics for the parcel column as a whole, by SSS type
def getAllParcelStats(staticdata):
    print ("Gathering Parcel Statistics... Function is too slow!")
    statset = []
    #PARCELS_TABLEDEF = ["SHAPE@", UID_PARCELCOL, "TAG", "LU", "evalue_2015", "evalue_2019", 
    #    "SC_SCELEM", "SC_SCMID", "SC_SCHIGH", 
    #    "NEAR_Dist_Parks", "NEAR_Dist_ShopZoneD", "DIST_UTIL", "FilterOut"]
    par_td_ids_with_stats = [6, 7, 8]

    cursor = arcpy.da.SearchCursor(staticdata, PARCELS_TABLEDEF)
    
    for i in range(0, (len(PARCELS_TABLEDEF)-1)):
        name = PARCELS_TABLEDEF[i]
        stat = []
        if (i in par_td_ids_with_stats):
            dataset = []
            for row in cursor:
                dataset.append(row[i])
            stat = getStatsOfDataSet(dataset)
            cursor.reset()
        statset.append([name, stat])
    
    print ("Assembled Parcel Statistics...")
    return statset


def scoreAllParcels(staticdata, surveydata, scenarioid, stats):
    parcelscores = []

    # Static Data Search Cursor [SHAPE@, ACCT, TAG, LU]
    stSCursor = arcpy.da.SearchCursor(staticdata, PARCELS_TABLEDEF)
    ctr = 0

    for stRow in stSCursor:
        #filter by cut ratio
        if ((ctr % CUTRATIO) > 0):
            ctr = ctr + 1
            continue

        ctrmsg = "%d" % ctr
        
        PID = stRow[1]
        parcelscores.append(scoreTSSParcel(stRow, surveydata, scenarioid, stats))
        printArcOut("Scored Row " + PID + " in StaticData..."+ctrmsg,-1)

        if (ctr > STOPPOINT):
            del stSCursor
            return
        ctr = ctr + 1

    #funwithresultsdata(parcelscores, scenarioid)
    del stSCursor
    printArcOut("Scored Results Data...",-1)

    return parcelscores


def scoreTSSParcel(parcel, surveydata, scenarioid, stats):
    # Set score in order of
    # "SSS_Price","SSS_SchoolE","SSS_SchoolM","SSS_SchoolH",
    # "SSS_Commute","SSS_Density","SSS_Shop","SSS_ParksRec","SSS_Utilities", "TSS"
    #results_scores = ["SSS_Price","SSS_SchoolE","SSS_SchoolM","SSS_SchoolH", 
    #                "SSS_Commute","SSS_Density","SSS_Shop","SSS_ParksRec","SSS_Utilities", "TSS"]
    
    tss = 0.0 #add weighted score here
    PID = parcel[1] #2nd column for ID
    scores = []

    #Price
    sss = getSSS_Price(parcel, surveydata)
    wgt = surveydata[0].attributes['r_price']
    scores.append([results_scores[0], sss, wgt])

    #SchoolE
    sss = getSSS_School(parcel, surveydata, PARCELS_TABLEDEF[6], stats)
    wgt = surveydata[0].attributes['r_schE']
    scores.append([results_scores[1], sss, wgt])

    #SchoolM
    sss = getSSS_School(parcel, surveydata, PARCELS_TABLEDEF[7], stats)
    wgt = surveydata[0].attributes['r_schM']
    scores.append([results_scores[2], sss, wgt])

    #SchoolH
    sss = getSSS_School(parcel, surveydata, PARCELS_TABLEDEF[8], stats)
    wgt = surveydata[0].attributes['r_schH']
    scores.append([results_scores[3], sss, wgt])

    #Commute
    sss = 0.0 #TBD
    wgt = surveydata[0].attributes['r_comm']
    scores.append([results_scores[4], sss, wgt])    
    
    #Density
    sss = getSSS_Density(parcel, surveydata)
    wgt = surveydata[0].attributes['r_density']
    scores.append([results_scores[5], sss, wgt])

    #Shop
    sss = getSSS_Proximity(parcel, surveydata, PARCELS_TABLEDEF[9])
    wgt = surveydata[0].attributes['r_shop']
    scores.append([results_scores[6], sss, wgt])

    #Parks
    sss = getSSS_Proximity(parcel, surveydata, PARCELS_TABLEDEF[10])
    wgt = surveydata[0].attributes['r_parks']
    scores.append([results_scores[7], sss, wgt])

    #Utilities
    sss = getSSS_Proximity(parcel, surveydata, PARCELS_TABLEDEF[11]) #revisit parcel data
    wgt = surveydata[0].attributes['r_utility']
    scores.append([results_scores[8], sss, wgt])

    #TSS
    for sc in scores:
        tss = tss + (sc[1] * (sc[2]/TSS_WEIGHT))
    scores.append([results_scores[len(results_scores)-1], tss, 1.0]) #no weight needed

    return PID, scores


# input: 
# parcel: the parcel to be scored [SHAPE@, ACCT, TAG, LU]
# survey: The survey data to read
# output: the numerical score for this parcel
def getSSS_Density(parcel, surveydata):
    score = 0.0 #set score from this

    user_survey = surveydata[0].attributes['pop_density']
    #print (user_survey)

    parcel_TAG = parcel[2]
    parcel_LU = parcel[3]
    parcel_survey = getSurveyDensityCodes(parcel_LU, parcel_TAG)
    #print (parcel_survey)

    # scoring based on how close the parcel is to the user survey
    iuser = density_survey.index( user_survey )
    iparc = density_survey.index( parcel_survey )
    idiff = abs(iuser - iparc)
    
    # score is inverse of % shift from user selection
    score = float(1.0 - (idiff/(len(density_survey)-1)))     
    #print (scenarioid)

    return boundScore(score)

# input: 
# parcel: the parcel to be scored [SHAPE@, ACCT, TAG, LU]
# survey: The survey data to read
# output: the numerical score for this parcel
def getSSS_Price(parcel, surveydata):
    score = 0.0 #set score from this
    score_low = PRICE_LOW_SCORE_DEF #score for price at survey calculated low
    score_high = PRICE_HIGH_SCORE_DEF #score for price at survey calculated high

    #do not score a parcel whos price is not set
    if ((parcel[4] != None) and (parcel[4]>=0.0) and
        (parcel[5] != None) and (parcel[5]>=0.0)):

        #get desired survey price rance
        user_survey_low = surveydata[0].attributes['price_low']
        user_survey_high = surveydata[0].attributes['price_high']
        user_survey_goal = surveydata[0].attributes['price_goal']
        
        #don't use exact number, in this case, use defaultrange
        if (DEQ(user_survey_low, 0.0)):
            user_survey_low = PRICE_LOW_PERC_DEF
        if (DEQ(user_survey_high, 0.0)):
            user_survey_low = PRICE_HIGH_PERC_DEF

        s_goal = user_survey_goal #straight input
        s_low  = s_goal - (s_goal * user_survey_low * 0.01)
        s_high = s_goal + (s_goal * user_survey_high * 0.01)

        p_price = getParcelPrice(parcel)

        if (DEQ(p_price, s_goal)): 
            score = SCORE_GOAL_DEF #will this ever happen?
        elif (p_price < s_goal):
            score = interpolateScore(p_price, s_low, s_goal, score_low, SCORE_GOAL_DEF) #low to goal
        else:
            score = interpolateScore(p_price, s_goal, s_high, SCORE_GOAL_DEF, score_high) #goal to high

    #always score between 0.0 and SCORE_GOAL_DEF
    return boundScore(score)

# input: 
# parcel: the parcel to be scored 
# survey: The survey data to read
# schoolcol: The name of the column in parcel for the school type
# schoolstats: statistics for the full school set
# output: the numerical score for this parcel
def getSSS_School(parcel, surveydata, schoolcol, stats):
    score = 0.0 #set score from this
    #scoring is based on 
    # 1) school district scored, scaled by scores
    # 2) utility by % of the schools grade scale that will be used by this family 
   
    # get school type and column
    school_ages = None
    for age in school_type_ages:
        if (schoolcol == age[0]):
            school_ages = age

    if (len(school_ages) > 0):
        sccol = PARCELS_TABLEDEF.index(school_ages[0])
        if (not sccol < 0):
            #get school stats
            schoolstats = stats[sccol]
            name = schoolstats[0]
            smin = schoolstats[1][0]
            smax = schoolstats[1][1]
            smean = schoolstats[1][2]
        
            #1)# % of school score from county (min,max)
            testscore_scaler = 0.2
            school_percentile = (parcel[sccol] - smin) / (smax - smin)
            testscore_factor = testscore_scaler + (( 1.0 - testscore_scaler ) * school_percentile)
            
            #2)#get school age time line. count the number of school grades (ages) the family overlaps
            school_timeline = []
            for sa in range(school_ages[1], school_ages[2]):
                school_timeline.append([sa, 0]) # individual school ages, count of family members

            #scroll survey creating long family age line
            res_length = surveydata[0].attributes['living_time']# num years in house
            for resident in surveydata[1]:
                res_age_en = resident.attributes['res_age'] #age at end of house
                res_age_st = res_age_en - res_length #age at beginning of house (may not be born?)

                for st in school_timeline:
                    # if this resident's timeline falls on a grade = overlap
                    # (should we score for multiple grade overlaps??? maybe not needed)
                    if ((res_age_st <= st[0]) and (res_age_en >= st[0])):
                        st[1] = 1
            
            # get percentage overlap of grades 
            grades_used = 0
            grades_total = len(school_timeline)
            for st in school_timeline:
                if (st[1] > 0):
                    grades_used += 1
            
            family_overlap_factor = float(grades_used / grades_total)
            if (family_overlap_factor>1.0):
                family_overlap_factor = 1.0

            # total family score: take percentage of testscore_factor, based on family overlap
            # full overlap=take 100% testscore, no overlap=take 50%(?)
            overlap_scaler = 0.5
            family_overlap_factor = overlap_scaler + (( 1.0 - overlap_scaler ) * family_overlap_factor)
            
            # multiply tests * overlap
            total_score = testscore_factor * family_overlap_factor

            #got score
            score = total_score

    #always score between 0.0 and SCORE_GOAL_DEF
    return boundScore(score)

#MOVE TO TOP

#proximity survey and thresholds: [0]=proximity type;[1]=score for survey match
#prox_survey_th = [[PARCELS_TABLEDEF[9],"prox_parks",0.8], [PARCELS_TABLEDEF[10],"prox_shop",0.8], [PARCELS_TABLEDEF[11],"prox_util",0.5]]
#proximity definition [0]=survey option [1]=distance in meters
#prox_distances = [["local",0.0], ["walk",400.0], ["one_mile",1609.3], ["three_mile",4828.0], ["area",6000.0], ["far",12000.0], ["remote",20000.0]]
#END MOVE TO TOP

def getSSS_Proximity(parcel, surveydata, proxcol): #, stats):
    score = 0.0 #set score from this
    # scoring is based on scaling with respect to survey options
    # The selection is considered a threshold.
    # Parcels ON the threshold score at PROX_THRESHOLD_XXX
    # In a close-to score, closer parcels scale up to 1.0, farther scale down to 0.0 
    # In a far-from score, farther parcels scale up to 1.0, closer scale down to 0.0
    # Scaling down will occur 2x as fast as scaling up 

   # get prox type and column
    prox_th = None
    pxzero_score = 1.0 #score at zero distance for close-to proximity
    pxend_score = 0.0  #score at remote distance for close-to proximity

    for th in prox_survey_th:
        if (proxcol == th[0]):
            prox_th = th
            if (th[1] == prox_survey_th[2][1]):
                pxzero_score = 0.0 #flip for far-from proximity
                pxend_score = 1.0 #flip for far-from proximity
    
    if (len(prox_th) > 0):
        pxcol = PARCELS_TABLEDEF.index(prox_th[0])
        if (not pxcol < 0):
            #get school stats (not needed)
            #pxstats = stats[pxcol]
            #name = pxstats[0]
            #smin = pxtats[1][0]
            #smax = pxstats[1][1]
            #smean = pxstats[1][2]
        
            #create scaler based on survey selection and prox_thresholds
            prox_selection = surveydata[0].attributes[ prox_th[1] ] #selection
            for ps in prox_distances:
                if (ps[0] == prox_selection):
                    prox_target = ps

            #scorecurve at 0dist,targetdist,remotedist: [0]value of parcel [1]score of parcel
            px_scorecurve = [[0,pxzero_score], [ prox_target[1], prox_th[2]], [ prox_distances[(len(prox_distances)-1)][1], pxend_score ]]            
            
            #get parcel distance and interpolate on score curve 
            parcel_dist = parcel[pxcol]
            if (parcel_dist < 0):# should clean data!
                parcel_dist = 0 
            if (parcel_dist > prox_target[1]):
                score = interpolateScore(parcel[pxcol], px_scorecurve[1][0], px_scorecurve[2][0], px_scorecurve[1][1], px_scorecurve[2][1])
            else:
                score = interpolateScore(parcel[pxcol], px_scorecurve[0][0], px_scorecurve[1][0], px_scorecurve[0][1], px_scorecurve[1][1])        

    #always score between 0.0 and SCORE_GOAL_DEF
    return boundScore(score)

#
# UTILIY Constants and functions
#
def getParcelPrice(parcel):
    p_price = float(-NO_DATA)
    if ((parcel[4] != None) and (parcel[4]>=0.0) and
        (parcel[5] != None) and (parcel[5]>=0.0)):
        p_price = (parcel[5] + parcel[4]) / 2.0 #take midpoint, as pricing may have been too aggressive
    return p_price


def getSurveyDensityCodes(lu, tag):
    sdc = density_survey[0] #default is non-redidential

    #first filer out businesses by lu
    if ((lu == density_lu[1]) or 
        (lu == density_lu[2]) or
        (lu == density_lu[4]) or
        (lu == density_lu[5]) or
        (lu == density_lu[6])):
        return sdc #non-residential by lu

    #set any non-default value
    if (tag == density_tag[0]): #AG
        sdc = density_survey[1] #default
        if ((lu == density_lu[3]) or
            (lu == density_lu[7]) or
            (lu == density_lu[9]) or
            (lu == density_lu[10])):
            sdc = density_survey[2]
    
    elif ((tag == density_tag[8]) or 
          (tag == density_tag[10]) or 
          (tag == density_tag[11])): #R1/#R3/#R4
        sdc = density_survey[4] #default
        if ((lu == density_lu[0]) or
            (lu == density_lu[8])):
            sdc = density_survey[2]

    elif (tag == density_tag[9]): #R2
        sdc = density_survey[5] #default
        if (lu == density_lu[0]):
            sdc = density_survey[2]
        elif (lu == density_lu[3]):
            sdc = density_survey[4]
 
    elif (tag == density_tag[12]): #RO
        sdc = density_survey[0] #default
        if (lu == density_lu[8]):
            sdc = density_survey[4]

    elif (tag == density_tag[14]): #RR
        sdc = density_survey[2] #default
        if (lu == density_lu[0]):
            sdc = density_survey[1]
            
    elif (tag == density_tag[15]): #RR*
        sdc = density_survey[2] #default
        if (lu == density_lu[0]):
            sdc = density_survey[1]
 
    elif (tag == density_tag[16]): #TOWNS
        sdc = density_survey[5] #default
        if (lu == density_lu[0]):
            sdc = density_survey[4]

    elif ((tag == density_tag[17]) or 
          (tag == density_tag[18])): #VB/#VR
        sdc = density_survey[3] #default
        if (lu == density_lu[0]):
            sdc = density_survey[1]

    return sdc #final return

def FEQ(v1, v2, tol):
    equal = False
    if (abs(v2-v1) < tol):
        equal = True
    return equal

def DEQ(v1, v2):
    return FEQ(v1, v2, TOL)

def interpolateScore(inval, lowval, hival, lowvalscore, highvalscore):
    i_score = -1.0
    if (lowval < hival):
        i_perc = ((inval - lowval) / (hival - lowval))
        i_score = lowvalscore + ((highvalscore - lowvalscore) * i_perc)
    else:
        i_score = -1.0 # error case, bad input

    return i_score

def boundScore(val):
    if (val > SCORE_GOAL_DEF):
        val = SCORE_GOAL_DEF
    elif (val < 0.0):
        val = 0.0
    return val

#returns line1[%overlap, start of overlap, end of overlap], line2[%overlap, start of overlap, end of overlap]
def percentageOverlapTimeline(line1, line2):
    overa = [0.0, 0, 0] #return %overlap, lowoverlap, high overlap
    lal = min(line1)
    lah = max(line1)
    lalen = lah - lal

    overb = [0.0, 0, 0] #return %overlap, lowoverlap, high overlap
    lbl = min(line2)
    lbh = max(line2)
    lblen = lbh - lbl

    #check for zero overlap
    if ((lal>lbh) or (lah<lbl)):
        overa=[0.0, 0, 0]
        overb=[0.0, 0, 0]
    else:
        #overlap exists
        #overa
        lapa = 1.0 #start, then trim off non-overlap
        sta = lal
        ena = lah
        if ((lal>=lbl) and (lah<=lbh)):
            lapa = 1.0 #100%
            sta = lal
            ena = lah
        else:
            if (lal<=lbl):
                lapa = lapa - (( lbl-lal ) / lalen) #truncate partial left
                sta = lbl
            if (lah>=lbh):
                lapa = lapa - (( lah-lbh ) / lalen) #truncate partial right
                ena = lbh
        overa = [lapa, sta, ena]

        #overb
        lapb = 1.0 #start, then trim off non-overlap
        stb = lbl
        enb = lbh
        if ((lal>=lbl) and (lah<=lbh)):
            lapb = 1.0 #100%
            stb = lbl
            enb = lbh
        else:
            if (lbl<=lal):
                lapb = lapb - (( la1-lb1 ) / lblen) #truncate partial left
                stb = lal 
            if (lbh>=lah):
                lapb = lapb - (( lbh-lah ) / lblen) #truncate partial right
                enb = lah
        overb = [lapb, stb, enb]

    return overa, overb


def getStatsOfDataSet(dataset):
    smin = float(-NO_DATA) #highval
    smax = float(NO_DATA) #lowval
    mean = smin
    for d in dataset:
        if (not d == None):
            if (d < smin):
                smin = d
            if (d > smax):
                smax = d
    mean = (smax + smin) / 2.0
    return smin, smax, mean

def getDataFromServiceSurvey(url, scnid):
    gis = GIS() # connect to www.arcgis.com anonymously. 
            # we will use a public sync enabled feature layer
    surveyflc = arcgis.features.FeatureLayerCollection(url, gis)
    
    # get feature layer
    whereClause = "\"" + UID_SURVEYCOL + "\" = '" + scnid + "'"
    feature_layer = surveyflc.layers[0]
    qrylyr = feature_layer.query(whereClause)
    surveyfeature = qrylyr.features[0]
    
    #get subtable
    subwhereClause = "\"" + UID_SURVEYSUBCOL + "\" = '" + scnid + "'"
    feature_subtable = surveyflc.tables[0]
    tbllyr = feature_subtable.query(subwhereClause)
    #print(tbllyr)
    surveytable = tbllyr.features

    #python_obj = json.loads(qrylyr)
    #density = python_obj["pop_density"]

    return surveyfeature, surveytable

def getDataFromServiceGeoDb(url):
    return LOCAL_GDB

def getDataFromServiceStatic(url):
    return LOCAL_STATIC

def getDataFromServiceResults(url):
    return LOCAL_RESULTS

def getDataFromServiceScenarioID(url):
    return LOCAL_SCN

# Utility Classes and Functions
#Exception classes
# Task [8] Step 8
#Fires if workspace is not valid
class NotWorkspaceException(Exception):
    def __init__(self):
        printArcOut("Program Ended... Path Does not exist", 1)
        

# Task [7] Step 8
#Fires if output dataset is not writable
class CannotWriteOutputException(Exception):
    def __init__(self):
        printArcOut("Program Ended... No Feature Class Created", 1)


# PART I
# Task [1]
try:

    #get GP Tools input: Refactor for GP
    
    # set workspace
    work = getDataFromServiceGeoDb(LOCAL_GDB) #raw_input("Enter the full path of GDB: ")
    if (not arcpy.Exists(work)):        #Capstone.gdb
        raise NotWorkspaceException
    else:
        arcpy.env.workspace = work
        arcpy.env.overwriteOutput = True
        printArcOut("Accessed Workspace...",-1)

    # read input data
    staticdata = getDataFromServiceStatic(LOCAL_STATIC) #raw_input("Enter the name-path of the Static Data ")
    if (not arcpy.Exists(staticdata)):
        raise NotWorkspaceException
    else:
        printArcOut("Accessed Static Data...",-1)

    resultsdata = getDataFromServiceResults(LOCAL_RESULTS) #raw_input("Enter the name-path of the Results Data ")
    if (not arcpy.Exists(resultsdata)):
        raise NotWorkspaceException
    else:
        printArcOut("Accessed Results Data...",-1)

    scenarioid = getDataFromServiceScenarioID(LOCAL_SCN) #raw_input("Enter the scenarioId in the Survey to analyze")
    if (scenarioid == ""):
        raise NotWorkspaceException
    else:
        printArcOut("Got Valid ScenarioID...",-1)
    
    surveydata = getDataFromServiceSurvey(LOCAL_SURVEY, scenarioid) #LOCAL_SURVEY #raw_input("Enter the name-path of the Survey Data ")
    if (not surveydata):
        raise NotWorkspaceException
    else:
        printArcOut("Accessed Survey Data...", -1)

    #fun with survey data
    funwithsurveydata(surveydata, scenarioid)

    #factory code = WGS 1984
    spatial_reference = arcpy.SpatialReference(4326) #???

    #BEGIN PROCESSING
    #zeroizeResults(staticdata, resultsdata, scenarioid)
    theStats = getAllParcelStats(staticdata)
    theScores = scoreAllParcels(staticdata, surveydata, scenarioid, theStats)

    #Write Results to Table FC
    writeParcelScoresToResults(staticdata, resultsdata, scenarioid, theScores)


# exception handling
except NotWorkspaceException as e:
    pass

# Task [7] Step 8
except CannotWriteOutputException as e:
    pass

except Exception as e:
    printException(e)
