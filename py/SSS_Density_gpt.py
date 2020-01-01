# Name: Mike Murphy
# Date: 31 JAN 2018
# Purpose: To exercise the use of geometry objects: PartII program as GP Tool
#imports
import os
import arcpy

#Globals
LOCAL_WORKSPACE = r"D:\UMD\GEOG656\Assignments\Lab8\Lab8_Data"
LOCAL_GDB = r"D:\UMD\GEOG656\Assignments\Lab8\Lab8_Data\WildlandFires.gdb"
FIRES_TEXT = r"D:\UMD\GEOG656\Assignments\Lab8\Lab8_Data\NorthAmericaWildfires_2007275.txt"
NATL_PARK = "D:\UMD\GEOG656\Assignments\Lab8\Lab8_Data\WildlandFires.gdb\NationalParks"
Z_THRESHOLD = 1.65

# standardize text output
#in: formatted text to print, message type code
#out: none
def printArcOut(msg, errCode):
    print (msg)
    if (errCode == 1):
        arcpy.AddWarning(msg)
    elif (errCode == 2):
        arcpy.AddError(msg)
    else:
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
    print "Error: " + str(e) # Prints Python-related errors
    #print arcpy.GetMessages() # Prints ArcPy-related errors
    arcpy.AddError(e) # Adds errors to ArcGIS custom tool


# Task [7] Step 8
# Get response from user whether to act. Validates input
# in: message to verify
# out: response as "Y" or "N"
def getUserOverwriteAction(msg):
    valid = ['Y', 'N']
    in_val = "initial"
    ctr = 0
    maxctr = 20 # so the user does not go on indefinitely
    while ((not in_val == valid[0]) and (not in_val == valid[1]) and (ctr < maxctr)):
        fullmsg = msg + " (Y or N): "
        in_val = raw_input (fullmsg)
        in_val = in_val.upper()
        ctr += 1

    # if the user took too many inputs, then just return 'N'
    if (ctr >= maxctr):
        print ("Bad (Y or N) input. Stopping.")
        in_val = valid[1]

    return in_val


# Task [6] Step 7
# Given a list of fires, counts how many inside the region
# in: feature class for point firelist, geometry for region
# out: count of items in firelist inside region, name of region
def getFiresCount(firelist, region):
    count = 0
    regionname = "NOT_IMPL"
    reg_sCur = arcpy.da.SearchCursor( region, ["SHAPE@", "Name"] )
    reg_row = reg_sCur.next()
    if (reg_row):  #only one feature
        regionname = reg_row[1]

        #Now get each object in firelist, and count those inside
        fire_sCur = arcpy.da.SearchCursor( firelist, ["SHAPE@"] )
        for fire_row in fire_sCur:
            if (reg_row[0].contains(fire_row[0])):
                count += 1

        del fire_sCur
        del fire_row

    del reg_sCur
    del reg_row

    return count, regionname

# Task [9] Step 7
# Given a point feature class, print out clustering report
# in: feature class for point firelist
# out:  z-score from Avg Nearest Neighbor, resulting classification
def getClusteringReport(sample_fc):
    result = "random"
    printArcOut("Performing Average Nearest Neighbor Analysis...",0)
    ann_output = arcpy.AverageNearestNeighbor_stats (sample_fc, "EUCLIDEAN_DISTANCE")
    z_score = float(ann_output[1])
    if (z_score > Z_THRESHOLD):
        result = "significantly dispersed"
    elif (z_score < (-1*Z_THRESHOLD)):
        result = "significantly clustered"
    else:
        result = "random"
    return z_score, result


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

    #get GPTool inputs
    work = arcpy.GetParameterAsText(0)
    openFile = arcpy.GetParameterAsText(1)
    attrTemplate = arcpy.GetParameterAsText(2)
    min_conf_entered = arcpy.GetParameterAsText(3)
    out_fc = arcpy.GetParameterAsText(4)

    # set workspace
    #work = raw_input("Enter the full path of WildlandFires.gdb: ")
    if (not arcpy.Exists(work)):        #Task [8] Step 8
        raise NotWorkspaceException
    
    arcpy.env.workspace = work
    arcpy.env.overwriteOutput = True

    # Step 4
    # read text file
    #openFile = raw_input("Enter the full path of wildfire text file: ")
    if (not arcpy.Exists(openFile)):    #Task [8] Step 8
        raise NotWorkspaceException

    # attribute Template
    if (not arcpy.Exists(attrTemplate)):
        raise NotWorkspaceException
    
    # Task [3] Step 7
    # get the output feature class name
    #out_fc = raw_input("Enter the name of the output feature class: ")
    out_path = os.path.split(out_fc)[0]
    out_name = os.path.split(out_fc)[1]
    #factory code = WGS 1984
    spatial_reference = arcpy.SpatialReference(4326)
    #Note: Defer the use of spatial reference WGS84, as National Parks is technically undefined

    # Task [7] Step 8
    # If output exists, let user choose whether to overwrite
    if (arcpy.Exists(out_fc)):
        action = getUserOverwriteAction("WARNING! This file exists! Overwrite?")
        if (action == "N"):
            raise CannotWriteOutputException
    
    # Task [4]
    # Get minimum confidence threshold. min_conf_threshold = 0 defaults to all data
    min_conf_threshold = int(min_conf_entered)

    #BEGIN PROCESSING
    #read the input text file
    f = open(openFile, 'r')
    lstFires = f.readlines()
    f.close()
    # Use last column as name of field
    hdr = lstFires[0].split(",")
    fldName = hdr[len(hdr)-1].strip()
   
    # create new featue class
    arcpy.CreateFeatureclass_management(out_path, out_name, "POINT", attrTemplate)
    #AddField not needed: as template provides column
    # use THE LAST column for cursor rendering
    #arcpy.AddField_management(out_fc, fldName, "SHORT")
    hdr = arcpy.ListFields(out_fc)
    fldName = hdr[len(hdr)-1].name

    # Task [3] Step 7
    # set insert cursor with new user-defined output feature class
    fields = ["SHAPE@", fldName]
    iCur = arcpy.da.InsertCursor(out_fc, fields)
    
    #Step 6
    #add new rows in cursor via text lines
    cntr = 0
    for fire in lstFires:
        if 'Latitude' in fire: # Skip the header
            continue
        # split text, parse to values, create point
        pnt = arcpy.Point()
        lstValues = fire.split(",")
        latitude = float(lstValues[0])
        longitude = float(lstValues[1])
        confid = int(lstValues[2].strip())
        #Task [4]
        #Only save if above minimum confidence Threshold
        if (confid > min_conf_threshold):
            #Task [2]
            # populate point and create new row
            pnt.X = longitude
            pnt.Y = latitude
        
            row = [pnt, confid]
            iCur.insertRow(row)
            cntr += 1
            
    #clean up, ready report
    printArcOut("%d records written to %s" % (cntr, out_name), 0)
    del iCur

    #get counts and clustering, IF data exists
    if (cntr > 0):
        # get count of fires in region
        fCountInfo = getFiresCount(out_fc, NATL_PARK)
        printArcOut("There were %d fires incidents within %s" % (fCountInfo[0], fCountInfo[1]), 1)

        # determine if data is clustered, dispersed, or random
        report = getClusteringReport(out_fc)
        printArcOut("The fire incidents are *%s* (z-score = %.2f)" % (report[1], report[0]), 1)
    else:
        printArcOut("No fires to report from the inputs", 1)

# Task [8] Step 8
except NotWorkspaceException as e:
    pass

# Task [7] Step 8
except CannotWriteOutputException as e:
    pass

except Exception as e:
    printException(e)
