# Name: Mike Murphy
# Date: 31 JAN 2018
# Purpose: To exercise the use of geometry objects: PartII program as GP Tool
#imports
import os
import arcpy
import arcpy.da
import json
import random
import re 
from copy import deepcopy

from arcgis.gis import GIS
from arcgis import geometry #use geometry module to project Long,Lat to X and Y
import arcgis.features
from arcgis.features import FeatureLayer
from arcgis.features import FeatureSet
from arcgis.features.feature import Feature
import arcgis.raster.analytics
from arcgis.raster.analytics import interpolate_points

#Globals
#for use in GDB
LOCAL_WS = r"D:\UMD\GEOG797\Project\Capstone" # use when in GDB
LOCAL_GDB = r"\Capstone.gdb"
LOCAL_STATIC = r"ParcelPt_Static"
LOCAL_RESULTS_TEMPLATE = r"ResultsTemplate"
LOCAL_RESULTS = r"SuitabilityResults"


#for use on-line
#LOCAL_WS = r"" # use when on-line
#LOCAL_STATIC = r"https://services5.arcgis.com/njRHYVhl2CMXMsap/arcgis/rest/services/ParcelPt_Static/FeatureServer"
#LOCAL_RESULTS_TEMPLATE = r"https://services5.arcgis.com/njRHYVhl2CMXMsap/arcgis/rest/services/ResultsTemplate/FeatureServer"
#LOCAL_RESULTS = r"https://services5.arcgis.com/njRHYVhl2CMXMsap/arcgis/rest/services/SuitabilityResults/FeatureServer"
#LOCAL_RESULTS = r"https://services5.arcgis.com/njRHYVhl2CMXMsap/arcgis/rest/services/SuitabilityResults_2/FeatureServer"
#LOCAL_RESULTS = r"https://services5.arcgis.com/njRHYVhl2CMXMsap/arcgis/rest/services/SuitabilityResults_3/FeatureServer"


#always online
LOCAL_SCN = r"{995c0601-bc77-43b1-8186-3edd46397699}" # A Place for Joe
#LOCAL_SCN = r"{b9667126-f170-47d2-855e-4ff216d3e6e7}" 
#LOCAL_SCN = r"{C6792777-3B7C-4D0D-8A1C-3CF96DD6EB0D}"
#LOCAL_SCN = r"{aa256b64-524c-486f-912f-4f9c0f096bd9}" # Kids With Many Wants
#LOCAL_SCN = r"{8e5b16e5-8f58-4406-8665-ee3ed0a6ffe7}" # Rural with Older Kids
#LOCAL_SCN = r"{4f20a181-1333-4955-88b3-5890c9ded87a}"
#LOCAL_SCN = r"{51204f65-2bd7-4eba-8fc7-f532a80fa8a1}"
LOCAL_SURVEY = r"https://services5.arcgis.com/njRHYVhl2CMXMsap/arcgis/rest/services/service_9eb8e96e758340a59c7630dd2f166af1/FeatureServer"

# raster processing (TBD)
LOCAL_INTERP_SCRATCH = r"HS_Interp"
LOCAL_ZIPCLIP = r"https://services5.arcgis.com/njRHYVhl2CMXMsap/arcgis/rest/services/Towns_and_Zips/FeatureServer"
LOCAL_RASTER_TEMPLATE = r"https://tiles.arcgis.com/tiles/njRHYVhl2CMXMsap/arcgis/rest/services/HS_RasSymTemplate/MapServer"
LOCAL_RASTER_RESULTS = r"https://tiles.arcgis.com/tiles/njRHYVhl2CMXMsap/arcgis/rest/services/HoodSearch_Results/MapServer"


#global IDS
UID_PARCELCOL = "ACCTID"  #unique id col for parcels
UID_SURVEYCOL = "GlobalID" #unique id col for surveys
UID_SURVEYSUBCOL = "ParentGlobalID" #unique id col for surveys


# Defines the columns in the results field
RESULTS_TABLEDEF = ["OBJECTID", "SHAPE@","Scenario","ACCTID","FilterOut",
        "TSS","SSS_Price","SSS_SchoolE","SSS_SchoolM","SSS_SchoolH",
        "SSS_Commute","SSS_Density","SSS_Shop","SSS_ParksRec","SSS_Utilities", 
        "ADDRTYP", "CITY", "ZIPCODE", "SUBDIVSN", "DSUBCODE", "DESCSUBD", "LU", "DESCLU", "ACRES",
        "LANDAREA", "LU_CODE", "Type", "TAG", "CLASSIFICA", "AVG_PRICE", "NAME_SCELEM", "NAME_SCMID", "NAME_SCHIGH"]

#defines the fields within the input parcels we will either score on or report on
PARCELS_TABLEDEF = ["SHAPE@", UID_PARCELCOL, "TAG", "LU", "evalue_2015", "evalue_2019", 
        "SC_SCELEM", "SC_SCMID", "SC_SCHIGH", "NEAR_DIST_Parks", "NEAR_DIST_Recreation", 
        "NEAR_DIST_ShopZoneD", "NEAR_DIST_ShopZoneGen", "NEAR_DIST_Utilities", "NAME_SCELEM", "NAME_SCMID", "NAME_SCHIGH", 
        "ADDRTYP", "ZIPNAME", "ZIPCODE1", "SUBDIVSN", "DSUBCODE", "DESCSUBD", "LU", "DESCLU", "ACRES",
        "LANDAREA", "LU_CODE", "Type", "TAG", "CLASSIFICA", "FilterOut"]
        #considered: DIST_RecPublic, Dist_Trails, ShopZoneGen, (revisit utilities)
        #considered: switch city, zipcode, with zip table join columns

STOPPOINT = 99000
CUTRATIO = 2 # ratio of number of input parcels to output results rows
TSS_WEIGHT = 0.25 # inverse ratio of TSS score scaling
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
school_type_ages = [["SC_SCELEM",5,11], ["SC_SCMID",11,14], ["SC_SCHIGH",14,18]]

#proximity survey and thresholds: [0]=proximity type;[1]=score for survey match
prox_survey_th = [[["NEAR_DIST_Parks", "NEAR_DIST_Recreation"] ,"prox_parks",0.8], 
                  [["NEAR_DIST_ShopZoneD", "NEAR_DIST_ShopZoneGen"],"prox_shop",0.8], 
                  [["NEAR_DIST_Utilities"],"prox_util",0.5]]
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
    score = getResultsSetByTypeOfScore(scores, suit_type)
    if (score):
        return getResultsValueOfScore(score)
    return None #not found

def getResultsSetByTypeOfScore(scores, suit_type):
    if (scores):
        for sc in scores:
            if (sc[0] == suit_type):
                return sc
    return None #not found


def getResultsValueByParcelScore(parcelscore, suit_type):
    return getResultsValueByTypeOfScore(parcelscore[1], suit_type)

def getResultsValueByParcel(parcelscores, acctid, suit_type):
    if (parcelscores):
        for ps in parcelscores:
            if (ps[0] == acctid):
                return getResultsValueByParcelScore(ps, suit_type)
    return None #not found


def writeParcelScoresToResults_Service(staticdata, resultsdata, scenarioid, parcelscores, resultstemp, deleteFirst):
    printArcOut("Writing Results Data to Output Svc...",0) 

    #setup count, added list, and updated list
    ctr = 0
    added_features = []
    updated_features = []
    # get feature layer for writing to
    resultsList = FeatureLayerToList(resultsdata)

    #first get template feature from any previous run
    if (resultstemp):
        resultstempList = FeatureLayerToList(resultstemp)
        template_result_feature = deepcopy(resultstempList[0]) #template should have 1 feature to use

    #optionally, delete all rows in results
    if (deleteFirst):
        printArcOut("Deleting previous results on-line",-1)
        resultsdata.delete_features(where='1=1')

    #now scroll parcels, adding parcels + results into added or updated list
    for featRow in staticdata:
        #filter by cut ratio
        if ((ctr % CUTRATIO) > 0):
            ctr = ctr + 1
            continue
        
        ctrmsg = "%d" % ctr
        # static row data
        #pt = arcpy.Point()
        #pt.clone(featRow.geometry)
        pt = featRow.geometry
        parcel = FeatureToParcel(featRow, PARCELS_TABLEDEF)
        PID = parcel[PARCELS_TABLEDEF.index(UID_PARCELCOL)]

        #filter out: if non-residential, remove
        filterout = parcel[PARCELS_TABLEDEF.index("FilterOut")]
        if (DEQ(filterout, 0.0)):
            #parcel score
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
            AVG_PRICE = getResultsSetByTypeOfScore(scores, results_scores[len(results_scores)-1])[2] #[2] holds average price
            #parcel attributes
            SURVEYID = scenarioid
            ADDRTYP = parcel[PARCELS_TABLEDEF.index("ADDRTYP")]
            CITY = parcel[PARCELS_TABLEDEF.index("ZIPNAME")]
            ZIPCODE = parcel[PARCELS_TABLEDEF.index("ZIPCODE1")]
            SUBDIVSN = parcel[PARCELS_TABLEDEF.index("SUBDIVSN")]
            DSUBCODE = parcel[PARCELS_TABLEDEF.index("DSUBCODE")]
            DESCSUBD = parcel[PARCELS_TABLEDEF.index("DESCSUBD")]
            LU = parcel[PARCELS_TABLEDEF.index("LU")]
            DESCLU = parcel[PARCELS_TABLEDEF.index("DESCLU")]
            ACRES = parcel[PARCELS_TABLEDEF.index("ACRES")]
            LANDAREA = parcel[PARCELS_TABLEDEF.index("LANDAREA")]
            LU_CODE = parcel[PARCELS_TABLEDEF.index("LU_CODE")]
            LU_Type = parcel[PARCELS_TABLEDEF.index("Type")]
            TAG = parcel[PARCELS_TABLEDEF.index("TAG")]
            CLASSIFICA = parcel[PARCELS_TABLEDEF.index("CLASSIFICA")]
            NAME_SCELEM = parcel[PARCELS_TABLEDEF.index("NAME_SCELEM")]
            NAME_SCMID = parcel[PARCELS_TABLEDEF.index("NAME_SCMID")]
            NAME_SCHIGH = parcel[PARCELS_TABLEDEF.index("NAME_SCHIGH")]

            result_feature = deepcopy(template_result_feature)

            #scores
            result_feature.geometry = pt
            result_feature.attributes['FilterOut'] = filterout
            result_feature.attributes['TSS'] = tss #TSS
            result_feature.attributes['SSS_Price'] = price #SSS...
            result_feature.attributes['SSS_SchoolE'] = sche #SSS...
            result_feature.attributes['SSS_SchoolM'] = schm #SSS...
            result_feature.attributes['SSS_SchoolH'] = schh #SSS...
            result_feature.attributes['SSS_Commute'] = comm #SSS...
            result_feature.attributes['SSS_Density'] = dens #SSS...
            result_feature.attributes['SSS_Shop'] = shop #SSS...
            result_feature.attributes['SSS_ParksRec'] = park #SSS...
            result_feature.attributes['SSS_Utilities'] = util #SSS...
            #attributes
            result_feature.attributes['ACCTID'] = PID #primary key
            result_feature.attributes['ADDRTYP'] = ADDRTYP
            result_feature.attributes['CITY'] = CITY
            result_feature.attributes['Scenario'] = SURVEYID
            result_feature.attributes['ZIPCODE'] = ZIPCODE
            result_feature.attributes['SUBDIVSN'] = SUBDIVSN
            result_feature.attributes['DSUBCODE'] = DSUBCODE
            result_feature.attributes['DESCSUBD'] = DESCSUBD
            result_feature.attributes['LU'] = LU
            result_feature.attributes['DESCLU'] = DESCLU
            result_feature.attributes['ACRES'] = ACRES
            result_feature.attributes['LANDAREA'] = LANDAREA
            result_feature.attributes['LU_CODE'] = LU_CODE
            result_feature.attributes['Type'] = LU_Type
            result_feature.attributes['TAG'] = TAG
            result_feature.attributes['CLASSIFICA'] = CLASSIFICA
            result_feature.attributes['AVG_PRICE'] = AVG_PRICE
            result_feature.attributes['NAME_SCELEM'] = NAME_SCELEM
            result_feature.attributes['NAME_SCMID'] = NAME_SCMID
            result_feature.attributes['NAME_SCHIGH'] = NAME_SCHIGH

            if (doesRowExist_Service(resultsList, PID) == False):
                added_features.append(result_feature)
                printArcOut("New Row " + PID + " in Results..."+ctrmsg,-1)
            else: 
                updated_features.append(result_feature)
                printArcOut("Updated Row " + PID + " in Results..."+ctrmsg,-1)

        if (ctr > STOPPOINT):
            return
        ctr = ctr + 1

    # place edits into feature layer
    if (resultsdata):
        try:
            if (len(updated_features) > 0):
                printArcOut("Updating existing results on-line", 0)
                resultsdata.edit_features(updates = updated_features)
        except Exception as e:
            printException(e)
        try:
            if (len(added_features) > 0):
                printArcOut("Adding new results on-line", 0)
                resultsdata.edit_features(adds = added_features)
        except Exception as e:
            printException(e)
           
    printArcOut("Completed writing of Results Data",0)   


# Writing scores to data table
def writeParcelScoresToResults(staticdata, resultsdata, scenarioid, parcelscores):
    printArcOut("Writing Results Data to Output...Too Slow!",0) 
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

        PID = stRow[PARCELS_TABLEDEF.index(UID_PARCELCOL)]
        #filter out: if non-residential, remove
        filterout = stRow[PARCELS_TABLEDEF.index("FilterOut")]
        scores = getResultsByParcel(parcelscores, PID)
        
        #parcel score
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
        AVG_PRICE = getResultsSetByTypeOfScore(scores, results_scores[len(results_scores)-1])[2] #[2] holds average price

        #parcel attributes
        SURVEYID = scenarioid
        ADDRTYP = stRow[PARCELS_TABLEDEF.index("ADDRTYP")]
        CITY = stRow[PARCELS_TABLEDEF.index("ZIPNAME")]
        ZIPCODE = stRow[PARCELS_TABLEDEF.index("ZIPCODE1")]
        SUBDIVSN = stRow[PARCELS_TABLEDEF.index("SUBDIVSN")]
        DSUBCODE = stRow[PARCELS_TABLEDEF.index("DSUBCODE")]
        DESCSUBD = stRow[PARCELS_TABLEDEF.index("DESCSUBD")]
        LU = stRow[PARCELS_TABLEDEF.index("LU")]
        DESCLU = stRow[PARCELS_TABLEDEF.index("DESCLU")]
        ACRES = stRow[PARCELS_TABLEDEF.index("ACRES")]
        LANDAREA = stRow[PARCELS_TABLEDEF.index("LANDAREA")]
        LU_CODE = stRow[PARCELS_TABLEDEF.index("LU_CODE")]
        LU_Type = stRow[PARCELS_TABLEDEF.index("Type")]
        TAG = stRow[PARCELS_TABLEDEF.index("TAG")]
        CLASSIFICA = stRow[PARCELS_TABLEDEF.index("CLASSIFICA")]
        NAME_SCELEM = stRow[PARCELS_TABLEDEF.index("NAME_SCELEM")]
        NAME_SCMID = stRow[PARCELS_TABLEDEF.index("NAME_SCMID")]
        NAME_SCHIGH = stRow[PARCELS_TABLEDEF.index("NAME_SCHIGH")]
        
        #RESULTS_TABLEDEF = ["OBJECTID", "SHAPE@","Scenario","ACCTID","FilterOut",
        #"TSS","SSS_Price","SSS_SchoolE","SSS_SchoolM","SSS_SchoolH",
        #"SSS_Commute","SSS_Density","SSS_Shop","SSS_ParksRec","SSS_Utilities", 
        #"ADDRTYP", "CITY", "ZIPCODE", "SUBDIVSN", "DSUBCODE", "DESCSUBD", "LU", "DESCLU", "ACRES",
        #"LANDAREA", "LU_CODE", "Type", "TAG", "CLASSIFICA", "AVG_PRICE", "NAME_SCELEM", "NAME_SCMID", "NAME_SCHIGH"]
        if (doesRowExist(resultsdata, PID) == False):
            if (DEQ(filterout, 0.0)):

                #insert
                resICursor.insertRow([ctr, pt, SURVEYID, PID, filterout,
                    tss, price, sche, schm, schh, comm, dens, shop, park, util,
                    ADDRTYP, CITY, ZIPCODE, SUBDIVSN, DSUBCODE, DESCSUBD, LU, DESCLU, ACRES,
                    LANDAREA, LU_CODE, LU_Type, TAG, CLASSIFICA, AVG_PRICE, NAME_SCELEM, NAME_SCMID, NAME_SCHIGH ])
                printArcOut("New Row " + PID + " in Results..."+ctrmsg,-1)
        else: 
            whereClause = "\"" + UID_PARCELCOL + "\" = \'" + PID + "\'"
            with arcpy.da.UpdateCursor(resultsdata, RESULTS_TABLEDEF, where_clause=whereClause) as resUCursor:
                for resRow in resUCursor:
                    if (DEQ(filterout, 0.0)):
                        #idfields
                        resRow[RESULTS_TABLEDEF.index("SHAPE@")] = pt
                        resRow[RESULTS_TABLEDEF.index("FilterOut")] = filterout
                        resRow[RESULTS_TABLEDEF.index("Scenario")] = SURVEYID
                        resRow[RESULTS_TABLEDEF.index("ACCTID")] = PID
                                              
                        #scores
                        resRow[RESULTS_TABLEDEF.index("TSS")] = tss #TSS
                        resRow[RESULTS_TABLEDEF.index("SSS_Price")] = price #SSS...
                        resRow[RESULTS_TABLEDEF.index("SSS_SchoolE")] = sche #SSS...
                        resRow[RESULTS_TABLEDEF.index("SSS_SchoolM")] = schm #SSS...
                        resRow[RESULTS_TABLEDEF.index("SSS_SchoolH")] = schh #SSS...
                        resRow[RESULTS_TABLEDEF.index("SSS_Commute")] = comm #SSS...
                        resRow[RESULTS_TABLEDEF.index("SSS_Density")] = dens #SSS...
                        resRow[RESULTS_TABLEDEF.index("SSS_Shop")] = shop #SSS...
                        resRow[RESULTS_TABLEDEF.index("SSS_ParksRec")] = park #SSS...
                        resRow[RESULTS_TABLEDEF.index("SSS_Utilities")] = util #SSS...

                        #attributes
                        resRow[RESULTS_TABLEDEF.index("ADDRTYP")] = ADDRTYP
                        resRow[RESULTS_TABLEDEF.index("CITY")] = CITY
                        resRow[RESULTS_TABLEDEF.index("ZIPCODE")] = ZIPCODE
                        resRow[RESULTS_TABLEDEF.index("SUBDIVSN")] = SUBDIVSN
                        resRow[RESULTS_TABLEDEF.index("DSUBCODE")] = DSUBCODE
                        resRow[RESULTS_TABLEDEF.index("DESCSUBD")] = DESCSUBD
                        resRow[RESULTS_TABLEDEF.index("LU")] = LU
                        resRow[RESULTS_TABLEDEF.index("DESCLU")] = DESCLU
                        resRow[RESULTS_TABLEDEF.index("ACRES")] = ACRES
                        resRow[RESULTS_TABLEDEF.index("LANDAREA")] = LANDAREA
                        resRow[RESULTS_TABLEDEF.index("LU_CODE")] = LU_CODE
                        resRow[RESULTS_TABLEDEF.index("Type")] = LU_Type
                        resRow[RESULTS_TABLEDEF.index("TAG")] = TAG
                        resRow[RESULTS_TABLEDEF.index("CLASSIFICA")] = CLASSIFICA
                        resRow[RESULTS_TABLEDEF.index("AVG_PRICE")] = AVG_PRICE
                        resRow[RESULTS_TABLEDEF.index("NAME_SCELEM")] = NAME_SCELEM
                        resRow[RESULTS_TABLEDEF.index("NAME_SCMID")] = NAME_SCMID
                        resRow[RESULTS_TABLEDEF.index("NAME_SCHIGH")] = NAME_SCHIGH

                        #update
                        resUCursor.updateRow(resRow)
                        printArcOut("Updated Row " + PID + " in Results..."+ctrmsg,-1)

        if (ctr > STOPPOINT):
            del stSCursor
            del resICursor
            return
        ctr = ctr + 1

    del stSCursor
    del resICursor
    printArcOut("Wrote Results Data...",0)   

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

def doesRowExist_Service(resultsdata, uid):
   for row in resultsdata:
       if (row.attributes[UID_PARCELCOL] == uid):
           return True
   #none found
   return False

#creates statistics for the parcel column as a whole, by SSS type
def getAllParcelStats_Service(staticdata):
    printArcOut("Gathering Parcel Statistics Svc...",0)
    statset = []
    #PARCELS_TABLEDEF = ["SHAPE@", UID_PARCELCOL, "TAG", "LU", "evalue_2015", "evalue_2019", 
    #    "SC_SCELEM", "SC_SCMID", "SC_SCHIGH", 
    #    "NEAR_DIST_Parks", "NEAR_DIST_ShopZoneD", "DIST_UTIL", "FilterOut"]
    par_td_ids_with_stats = ["SC_SCELEM", "SC_SCMID", "SC_SCHIGH"]

    dataset = []
    for row in staticdata:
        dataset.append(row)

    for idx in range(0, len(PARCELS_TABLEDEF)-1):
        name = PARCELS_TABLEDEF[idx]
        stat = []
        if name in par_td_ids_with_stats:
            rowset = []
            for r in dataset:
                val = r.get_value(name)
                rowset.append(val)
            stat = getStatsOfDataSet(rowset)
        statset.append([name, stat])
    
    printArcOut("Assembled Parcel Statistics...",0)
    return statset

#creates statistics for the parcel column as a whole, by SSS type
def getAllParcelStats(staticdata):
    printArcOut("Gathering Parcel Statistics... Optimize this.",0)
    statset = []
    #PARCELS_TABLEDEF = ["SHAPE@", UID_PARCELCOL, "TAG", "LU", "evalue_2015", "evalue_2019", 
    #    "SC_SCELEM", "SC_SCMID", "SC_SCHIGH", 
    #    "NEAR_DIST_Parks", "NEAR_DIST_ShopZoneD", "DIST_UTIL", "FilterOut"]
    par_td_ids_with_stats = [PARCELS_TABLEDEF.index("SC_SCELEM"), 
                             PARCELS_TABLEDEF.index("SC_SCMID"), 
                             PARCELS_TABLEDEF.index("SC_SCHIGH")]

    dataset = []
    cursor = arcpy.da.SearchCursor(staticdata, PARCELS_TABLEDEF)
    for row in cursor:
        dataset.append(row)

    for idx in range(0, len(PARCELS_TABLEDEF)-1):
        name = PARCELS_TABLEDEF[idx]
        stat = []
        if idx in par_td_ids_with_stats:
            rowset = []
            for r in dataset:
                rowset.append(r[idx])
            stat = getStatsOfDataSet(rowset)
        statset.append([name, stat])
    
    printArcOut("Assembled Parcel Statistics...",0)
    return statset

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

def scoreAllParcels(staticdata, surveydata, scenarioid, stats):
    printArcOut("Calculate Scoring Data...",0)
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
    printArcOut("Scored Results Data...",0)

    return parcelscores

def scoreAllParcels_Service(staticdata, surveydata, scenarioid, stats):
    printArcOut("Calculate Scoring Data...",0)
    parcelscores = []

    # Static Data Search Cursor [SHAPE@, ACCT, TAG, LU]
    # stSCursor = arcpy.da.SearchCursor(staticdata, PARCELS_TABLEDEF)
    ctr = 0

    for stRow in staticdata:
        #filter by cut ratio
        if ((ctr % CUTRATIO) > 0):
            ctr = ctr + 1
            continue

        ctrmsg = "%d" % ctr
        parcel = FeatureToParcel(stRow, PARCELS_TABLEDEF)

        PID = parcel[PARCELS_TABLEDEF.index(UID_PARCELCOL)]
        parcelscores.append(scoreTSSParcel(parcel, surveydata, scenarioid, stats))
        printArcOut("Scored Row " + PID + " in StaticData..."+ctrmsg,-1)

        if (ctr > STOPPOINT):
            #del stSCursor
            return
        ctr = ctr + 1

    #funwithresultsdata(parcelscores, scenarioid)
    #del stSCursor
    printArcOut("Scored Results Data...",0)

    return parcelscores

def scoreTSSParcel(parcel, surveydata, scenarioid, stats):
    # Set score in order of
    #results_scores = ["SSS_Price","SSS_SchoolE","SSS_SchoolM","SSS_SchoolH", 
    #                "SSS_Commute","SSS_Density","SSS_Shop","SSS_ParksRec","SSS_Utilities", "TSS"]
    PID = 0
    scores = []
    try:
        tss = 0.0 #add weighted score here
        PID = parcel[PARCELS_TABLEDEF.index(UID_PARCELCOL)] #2nd column for ID

        #Price
        sss = getSSS_Price(parcel, surveydata)
        wgt = surveydata[0].attributes['r_price']
        scores.append([results_scores[0], sss, wgt])

        #SchoolE
        sss = getSSS_School(parcel, surveydata, school_type_ages[0][0], stats)
        wgt = surveydata[0].attributes['r_schE']
        scores.append([results_scores[1], sss, wgt])

        #SchoolM
        sss = getSSS_School(parcel, surveydata, school_type_ages[1][0], stats)
        wgt = surveydata[0].attributes['r_schM']
        scores.append([results_scores[2], sss, wgt])

        #SchoolH
        sss = getSSS_School(parcel, surveydata, school_type_ages[2][0], stats)
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
        sss = getSSS_Proximity(parcel, surveydata, prox_survey_th[1][0])
        wgt = surveydata[0].attributes['r_shop']
        scores.append([results_scores[6], sss, wgt])

        #Parks
        sss = getSSS_Proximity(parcel, surveydata, prox_survey_th[0][0])
        wgt = surveydata[0].attributes['r_parks']
        scores.append([results_scores[7], sss, wgt])

        #Utilities
        sss = getSSS_Proximity(parcel, surveydata, prox_survey_th[2][0]) #revisit parcel data
        wgt = surveydata[0].attributes['r_utility']
        scores.append([results_scores[8], sss, wgt])

        #TSS
        for sc in scores:
            tss = tss + (sc[1] * (sc[2]/TSS_WEIGHT))
        scores.append([results_scores[len(results_scores)-1], tss, getParcelPrice(parcel)]) #weight = average price

    except Exception as e:
        printException(e)

    return PID, scores


# input: 
# parcel: the parcel to be scored [SHAPE@, ACCT, TAG, LU]
# survey: The survey data to read
# output: the numerical score for this parcel
def getSSS_Density(parcel, surveydata):
    score = 0.0 #set score from this
    
    try:
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

        score = boundScore(score)#always score between 0.0 and SCORE_GOAL_DEF
    
    except Exception as e:
        printException(e)

    return boundScore(score)#always score between 0.0 and SCORE_GOAL_DEF

# input: 
# parcel: the parcel to be scored [SHAPE@, ACCT, TAG, LU]
# survey: The survey data to read
# output: the numerical score for this parcel
def getSSS_Price(parcel, surveydata):
    score = 0.0 #set score from this
    score_low = PRICE_LOW_SCORE_DEF #score for price at survey calculated low
    score_high = PRICE_HIGH_SCORE_DEF #score for price at survey calculated high

    try:
        #do not score a parcel whos price is not set
        if ((parcel[PARCELS_TABLEDEF.index("evalue_2015")] != None) and (parcel[PARCELS_TABLEDEF.index("evalue_2015")]>=0.0) and
            (parcel[PARCELS_TABLEDEF.index("evalue_2019")] != None) and (parcel[PARCELS_TABLEDEF.index("evalue_2019")]>=0.0)):
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
    
    except Exception as e:
        printException(e)

    return boundScore(score)#always score between 0.0 and SCORE_GOAL_DEF

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
   
    try:
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
                #testscore_scaler = 0.2
                #school_percentile = (parcel[sccol] - smin) / (smax - smin)
                #testscore_factor = testscore_scaler + (( 1.0 - testscore_scaler ) * school_percentile)

                testscore_factor = parcel[sccol] / smax
                
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
    
    except Exception as e:
        printException(e)

    return boundScore(score)#always score between 0.0 and SCORE_GOAL_DEF

#MOVE TO TOP

#proximity survey and thresholds: [0]=proximity type;[1]=score for survey match
#prox_survey_th = [[["NEAR_DIST_Parks", "NEAR_DIST_Recreation"] ,"prox_parks",0.8], 
#                  [["NEAR_DIST_ShopZoneD", "NEAR_DIST_ShopZoneGen"],"prox_shop",0.8], 
#                  [["NEAR_DIST_Utilities"],"prox_util",0.5]]
#proximity definition [0]=survey option [1]=distance in meters
#prox_distances = [["local",0.0], ["walk",400.0], ["one_mile",1609.3], ["three_mile",4828.0], ["area",6000.0], ["far",12000.0], ["remote",20000.0]]

#END MOVE TO TOP

def getSSS_Proximity(parcel, surveydata, proxcol): #, stats):
    try:
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
            if (th[0] == proxcol):
                prox_th = th
                if (prox_th[1] == prox_survey_th[2][1]):
                    pxzero_score = 0.0 #flip for far-from proximity
                    pxend_score = 1.0 #flip for far-from proximity
        
        subscores = []
        if (not prox_th == None):
            pxcols = prox_th[0]
            
            for pxc in pxcols:

                pidx = PARCELS_TABLEDEF.index(pxc)
                if (not pidx < 0):
                    #get school stats (not needed)
                    #pxstats = stats[pidx]
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
                    parcel_dist = parcel[pidx]
                    if (parcel_dist < 0):# should clean data!
                        parcel_dist = 0 
                    if (parcel_dist > prox_target[1]):
                        subscores.append(interpolateScore(parcel[pidx], px_scorecurve[1][0], px_scorecurve[2][0], px_scorecurve[1][1], px_scorecurve[2][1]))
                    else:
                        subscores.append(interpolateScore(parcel[pidx], px_scorecurve[0][0], px_scorecurve[1][0], px_scorecurve[0][1], px_scorecurve[1][1]))

        #average scores
        num_s = len(subscores)
        if (num_s > 0):
            for s in subscores:
                score += s
            score = score / num_s   
    
    except Exception as e:
        printException(e)

    return boundScore(score)#always score between 0.0 and SCORE_GOAL_DEF
#
# UTILIY Constants and functions
#
def FeatureToParcel(feature, tabledef):
    parcel = []
    if (not feature == None):
        row = feature.as_row
        for col in tabledef:
            try:
                colidx = row[1].index(col)
                parcel.append(row[0][colidx])
            except Exception as e:
                printException(e)

    return parcel

def FeatureLayerToList(feature_layer):
    if (feature_layer):
        qrylyr = feature_layer.query(return_all_records=True)
        featurelist = qrylyr.features
        return featurelist
    else:
        return None

def getParcelPrice(parcel):
    p_price = 0.0 #float(NO_DATA)
    if ((parcel[PARCELS_TABLEDEF.index("evalue_2015")] != None) and (parcel[PARCELS_TABLEDEF.index("evalue_2015")]>=0.0) and
        (parcel[PARCELS_TABLEDEF.index("evalue_2019")] != None) and (parcel[PARCELS_TABLEDEF.index("evalue_2019")]>=0.0)):
        p_price = (parcel[PARCELS_TABLEDEF.index("evalue_2015")] + parcel[PARCELS_TABLEDEF.index("evalue_2019")]) / 2.0 #take midpoint, as pricing may have been too aggressive
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

# Program to find the URL from an input string  
def isValidUrl(url):
    ur = re.findall('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\), ]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', url) 
    return (len(ur)>0)

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

# Data Access functions
def getDataFromServiceGeoDb(url):
    return url


def getDataFromServiceParcels(url):
    printArcOut("Accessing Static Data...",0)

    if (isValidUrl(url)):
        conn = GIS() # connect to www.arcgis.com anonymously. 
                # we will use a public sync enabled feature layer
        parcelflc = arcgis.features.FeatureLayerCollection(url, conn)

        # get feature layer
        #whereClause = "\"" + UID_SURVEYCOL + "\" = '" + scnid + "'"
        feature_layer = parcelflc.layers[0]
        #qrylyr = feature_layer.query(whereClause)
        qrylyr = feature_layer.query(return_all_records=True)
        parcelfeatures = qrylyr.features

        #python_obj = json.loads(qrylyr)

    else:
        parcelfeatures = url # from gdb, we just need this

    return parcelfeatures

def getDataFromServiceScenarioID(url):
    return url

def getDataFromServiceSurvey(url, scnid):
    printArcOut("Accessing Survey Data...",0)
    conn = GIS() # connect to www.arcgis.com anonymously. 
            # we will use a public sync enabled feature layer
    surveyflc = arcgis.features.FeatureLayerCollection(url, conn)

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

def getDataFromServiceResultsTemplate(url):
    printArcOut("Accessing Results Template Data...",0)
    if (isValidUrl(url)):
        conn = GIS() # connect to www.arcgis.com anonymously. 
                # we will use a public sync enabled feature layer
        resultsflc = arcgis.features.FeatureLayerCollection(url, conn)

        # get feature layer
        feature_layer = resultsflc.layers[0]
        resultsfeatures = feature_layer

    else:
        resultsfeatures = url # from gdb, we just need this

    return resultsfeatures

def getDataFromServiceClipData(url):
    printArcOut("Accessing Clip Boundary Data...",0)
    if (isValidUrl(url)):
        conn = GIS() # connect to www.arcgis.com anonymously. 
                # we will use a public sync enabled feature layer
        resultsflc = arcgis.features.FeatureLayerCollection(url, conn)

        # get feature layer
        feature_layer = resultsflc.layers[0]
        clipfeatures = feature_layer

    else:
        clipfeatures = url # from gdb, we just need this

    return clipfeatures

def getDataFromServiceResults(url):
    printArcOut("Accessing Results Data...",0)
    if (isValidUrl(url)):
        conn = GIS() # connect to www.arcgis.com anonymously. 
                # we will use a public sync enabled feature layer
        resultsflc = arcgis.features.FeatureLayerCollection(url, conn)

        # get feature layer
        #whereClause = "\"" + UID_SURVEYCOL + "\" = '" + scnid + "'"
        feature_layer = resultsflc.layers[0]
        #qrylyr = feature_layer.query(whereClause)
        #qrylyr = feature_layer.query(return_all_records=True)
        #resultsfeatures = qrylyr.features
        
        resultsfeatures = feature_layer
        #python_obj = json.loads(qrylyr) 

    else:
        resultsfeatures = url # from gdb, we just need this

    return resultsfeatures

def getDataFromServiceResolution(res):
    r = NO_DATA
    if (not res==''):
        ires = int(res)
        if ((ires>=1) and (ires<=5000)):
            r = ires
    return r

def getDataFromServiceWeight(wgt):
    w = NO_DATA
    if (not wgt==''):
        fwgt = float(wgt)
        if ((fwgt>=0.001) and (fwgt<=1000)):
            w = fwgt
    return w

def getDataFromServices(work_in, parcels_in, survey_in, scenarioId_in, resolution_in, 
weight_in, results_in, resultstemplate_in, clipdata_in):
    # gis connection
    conn = ''

    # set resolution and weight
    ratio = getDataFromServiceResolution(resolution_in)
    if (DEQ(ratio, NO_DATA)):
        ratio = CUTRATIO #use default
    else:
        printArcOut("Downsampling results by "+ str(ratio) + " times.",0)

    weight = getDataFromServiceWeight(weight_in)
    if (DEQ(weight, NO_DATA)):
        weight = TSS_WEIGHT #use default
    else:
        printArcOut("Results reweighted by " + str(1/weight) + " times.",0)

     # set workspace (ONLY IF USED)
    if (work_in != ""):
        gdb = work_in + LOCAL_GDB
        work = getDataFromServiceGeoDb(gdb) #raw_input("Enter the full path of GDB: ")
        if (not arcpy.Exists(work)):        #Capstone.gdb
            raise NotWorkspaceException
        else:
            arcpy.env.workspace = work
            arcpy.env.overwriteOutput = True
            printArcOut("Accessed Workspace...",0)
    else:
        work = ""
        printArcOut("No Local Workspace Required...",0)

    # read static data
    if (parcels_in == ""):
        parcels_in = LOCAL_STATIC
    staticdata = getDataFromServiceParcels(parcels_in) #raw_input("Enter the name-path of the Static Data ")
    if (not staticdata):
    #if (not arcpy.Exists(staticdata)):
        raise NotWorkspaceException
    else:
        printArcOut("Accessed Static Data...",0)
    
    # read input scenario ID
    if (scenarioId_in == ""):
        scenarioId_in = LOCAL_SCN
    scenarioid = getDataFromServiceScenarioID(scenarioId_in) #raw_input("Enter the scenarioId in the Survey to analyze")
    if (scenarioid == ""):
        raise NotWorkspaceException
    else:
        printArcOut("Got Valid ScenarioID...",0)   
    
    # read survey data
    if (survey_in == ""):
        survey_in = LOCAL_SURVEY
    surveydata = getDataFromServiceSurvey(survey_in, scenarioid) #LOCAL_SURVEY #raw_input("Enter the name-path of the Survey Data ")
    if (not surveydata):
        raise NotWorkspaceException
    else:
        printArcOut("Accessed Survey Data...", 0)
    
    # read results table
    if (results_in == ""):
        results_in = LOCAL_RESULTS
    resultsdata = getDataFromServiceResults(results_in) #raw_input("Enter the name-path of the Results Data ")
    if (not resultsdata):
        raise NotWorkspaceException
    else:
        printArcOut("Accessed Results Data...", 0)
    
    # read results template
    if (resultstemplate_in == ""):
        resultstemplate_in = LOCAL_RESULTS_TEMPLATE
    resultstemplate = getDataFromServiceResultsTemplate(resultstemplate_in) #raw_input("Enter the name-path of the Results Data ")
    if (not resultstemplate):
        raise NotWorkspaceException
    else:
        printArcOut("Accessed Results Template Data...", 0)

    # read clip data
    if (clipdata_in == ""):
        clipdata_in = LOCAL_ZIPCLIP
    clipdata = getDataFromServiceResultsTemplate(clipdata_in) #raw_input("Enter the name-path of the Results Data ")
    if (not clipdata):
        raise NotWorkspaceException
    else:
        printArcOut("Accessed Clip Data...", 0)

    #recreating results...if needed. May not be
    if ((arcpy.Exists(work)) and (not arcpy.Exists(resultsdata))):

        #attempt to create
        #sr = arcpy.Describe(staticdata).spatialReference
        outtable = os.path.basename(resultsdata)
        templatetable = arcpy.ValidateTableName(resultstemplate)
        
        #printArcOut(work+"::"+outtable+"::POINT::"+templatetable+"::None::None", 0)
        arcpy.CreateFeatureclass_management(work, outtable, "POINT", templatetable, None, None)
        if (not arcpy.Exists(resultsdata)):
            raise NotWorkspaceException
        else:
            printArcOut("Accessed Results Data...",0)

    #fun with survey data
    #funwithsurveydata(surveydata, scenarioid)

    #return path to accessed data
    return work, staticdata, surveydata, scenarioid, resultsdata, resultstemplate, ratio, weight, clipdata
   

# Utility Classes and Functions
#Exception classes
#Fires if workspace is not valid
class NotWorkspaceException(Exception):
    def __init__(self):
        printArcOut("Program Ended... Path Does not exist", 2)
        
#Fires if output dataset is not writable
class CannotWriteOutputException(Exception):
    def __init__(self):
        printArcOut("Program Ended... No Feature Class Created", 2)


# MAIN****MAIN****MAIN
# MAIN****MAIN****MAIN
# MAIN****MAIN****MAIN
try:
    #to define whether interpolation is inside this python
    symbolize_raster_results = False

    work_in = '' # do not use locally
    if (not arcpy.GetParameterAsText(3) == ""):
        work_in = arcpy.GetParameterAsText(3)
    staticdata_in = LOCAL_STATIC
    surveydata_in = LOCAL_SURVEY
    scenarioid_in = LOCAL_SCN
    if (not arcpy.GetParameterAsText(0) == ""):
        scenarioid_in = arcpy.GetParameterAsText(0)
    resultsdata_in = LOCAL_RESULTS
    ratio_in = CUTRATIO
    if (not arcpy.GetParameterAsText(1) == ""):
        ratio_in = arcpy.GetParameterAsText(1)
    weight_in = TSS_WEIGHT
    if (not arcpy.GetParameterAsText(2) == ""):
        weight_in = arcpy.GetParameterAsText(2)
    resultstemplate_in = LOCAL_RESULTS_TEMPLATE
    resultsinterp_in = LOCAL_INTERP_SCRATCH
    resultsinterpclip_in = LOCAL_ZIPCLIP
    rastersymbtemplate_in = LOCAL_RASTER_TEMPLATE
    irrs_in = LOCAL_RASTER_RESULTS

    #get GP Tools input: Refactor for GP
    #work_in = arcpy.GetParameterAsText(0)
    #staticdata_in = arcpy.GetParameterAsText(1)
    #surveydata_in = arcpy.GetParameterAsText(2)
    #scenarioid_in = arcpy.GetParameterAsText(3)
    #resultsdata_in = arcpy.GetParameterAsText(4)
    #ratio_in = arcpy.GetParameterAsText(5)
    #weight_in = arcpy.GetParameterAsText(6)
    #resultstemplate_in = arcpy.GetParameterAsText(7)
    #resultsinterp_in = arcpy.GetParameterAsText(8)
    #resultsinterpclip_in = arcpy.GetParameterAsText(9)
    #rastersymbtemplate_in = arcpy.GetParameterAsText(10)
    #irrs_in = arcpy.GetParameterAsText(11)

    printArcOut("workspace(remove):  "+ work_in, 0)
    printArcOut("parcel set:  "+ staticdata_in, 0)
    printArcOut("survey set:  "+ surveydata_in, 0)
    printArcOut("scenarioid:  "+ scenarioid_in, 0)
    printArcOut("results set:  "+ resultsdata_in, 0)
    printArcOut("ratio:  "+ str(ratio_in), 0)
    printArcOut("weight:  "+ str(weight_in), 0)
    printArcOut("results template:  "+ resultstemplate_in, 0)
    #printArcOut("results interpolated:  "+ resultsinterp_in, 0)
    printArcOut("results interpolated clipped:  "+ resultsinterpclip_in, 0)
    #printArcOut("results symbol template:  "+ rastersymbtemplate_in, 0)
    #printArcOut("interpolated raster:  "+ irrs_in, 0)

    # get all data
    analysis_data = getDataFromServices(work_in, staticdata_in, surveydata_in, scenarioid_in, ratio_in, weight_in, resultsdata_in, resultstemplate_in, resultsinterpclip_in)
    if (analysis_data):
        work        = analysis_data[0]
        staticdata  = analysis_data[1]
        surveydata  = analysis_data[2]
        scenarioid  = analysis_data[3]
        resultsdata = analysis_data[4]
        resultstemp = analysis_data[5]
        CUTRATIO    = analysis_data[6]
        TSS_WEIGHT  = analysis_data[7]
        clipdata    = analysis_data[8]
    else:
        raise NotWorkspaceException

    #determines if we run from on-line data or from Arc Desktop
    localized_workspace = arcpy.Exists(work)

    #factory code = WGS 1984
    spatial_reference = arcpy.SpatialReference(4326) #???

    #BEGIN PROCESSING
    #zeroizeResults(staticdata, resultsdata, scenarioid)

    if (localized_workspace):
        theStats = getAllParcelStats(staticdata)
        theScores = scoreAllParcels(staticdata, surveydata, scenarioid, theStats)  
        writeParcelScoresToResults(staticdata, resultsdata, scenarioid, theScores)
    else:
        theStats = getAllParcelStats_Service(staticdata)
        theScores = scoreAllParcels_Service(staticdata, surveydata, scenarioid, theStats)
        writeParcelScoresToResults_Service(staticdata, resultsdata, scenarioid, theScores, resultstemp, True) #Write Results to Table FC

    # if interpolating results here, run 
    if (symbolize_raster_results and not localized_workspace):
        #get required tools
        conn = GIS() # connect to www.arcgis.com anonymously.
        supported = True #arcgis.raster.analytics.is_supported(conn)
        if (supported == True):
            # sign in
            
            # (1)(either IDW|Kriging)
            results_interp = LOCAL_RASTER_RESULTS
            printArcOut("Interpolating Results into Raster....", 0)
            arcgis.raster.interpolate_points(input_point_features = resultsdata, interpolate_field = "TSS", optimize_for = "BALANCE", output_name = results_interp, gis=conn)
            #arcgis.interpolate_points(input_layer = resultsdata, field = "TSS", interpolate_option="5", bounding_polygon_layer=clipdata, gis=conn)
            
            # (2)Clip Raster using cityZip layer
            printArcOut("Clipping to County Area Extents....TBD", 0)
            arcgis.raster.clip(raster = results_interp, geometry = clipdata)

            # (3)Sybolize using RasterResultsTemplate 
            printArcOut("Setting Raster Symbology....TBD", 0)

        else:
            printArcOut("Raster Analytics not supported", 1)

    printArcOut("***HoodSearch_Suitability is complete***", 0)


# exception handling
except NotWorkspaceException as e:
    pass

# Task [7] Step 8
except CannotWriteOutputException as e:
    pass

except Exception as e:
    printException(e)