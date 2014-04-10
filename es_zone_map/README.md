#Elementary School Zones Mapping App 

###Description
This app is meant to replace the static/JPG elementary school zone maps on [InsideSchools.org](http://insideschools.org). 

###How it works
This app works by accepting a "DBN" number* which is passed to it from an elementary school's webpage on InsideSchools. This happens when a user clicks on "view zone map". The map will then style geojson data** for all elementary school zones that contain the given DBN number. The school matching the DBN will also be rendered as a marker. These layers are then grouped so the map can pan and zoom to their maximum extent. If the user is browsing multiple elementary school zone maps then the feature group is first cleared so that only the last zones for the current elementary school webpage will be displayed.

*DBN's are a sort of a non-unique identifier for NYC elementary school zones. Zones can contain multiple DBN's which in turn match actual schools. Thus a single school may have multiple zones. A zone means anyone living within its immediate boundary is elegible to attend that school. Not all schools have zones and zones differ by elementary, middle and highschoo to further complicate the matter.

**data for elementary school zones for the years 2013-2014 was sourced from the [NYC Open Data portal](https://nycopendata.socrata.com/) and may be found [here](https://data.cityofnewyork.us/Education/2013-2014-School-Zones/pp5b-95kq).