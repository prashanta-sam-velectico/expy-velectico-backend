<%- include('../admin/header'); %>

<div class="header"> 
    <h1 class="page-header">
        Dashboard
    </h1>
    <ol class="breadcrumb">
    <li><a href="#">Dashboard</a></li>
    <li class="active">Referral Request</li>
</ol> 
                
</div>

<div id="page-inner">
	<div class="row">
                    <div class="col-md-12">
                        <!-- Advanced Tables -->
                        <div class="card">
                            <div class="card-action">
                                 Advanced Tables
                            </div>
                            <div class="card-content">
                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered table-hover" id="tbl_purchase">
                                        <thead>
                                            <tr>                                              
                                                <th>Email</th>   
                                                <th>Date</th>    
                                            	<th>Action </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <% 
                                               data.forEach(function(item) {  
                                              
                                               %>
                                                <tr class="odd gradeX">                                                	
                                                  
                                                    <td><%= item.Ref_Email %></td>
                                                    <td><%= moment(item.Create_Date).format( 'MMM-DD-YYYY') %>                                                  	
                                                    <td class="center">     
                                                      <select id="<%= item.RCM_ID %>">
                                                        <option value="EXP-BYC1023">EXP-BYC1023</option>
                                                        <option value="EXP-BYC1024">EXP-BYC1024</option>
                                                      </select>
                                                    </td>
                                                 </tr>
                                              <% }); %>
                                        </tbody>
                                    </table>
                                             
                                </div>
                                
                            </div>
                        </div>
                        <!--End Advanced Tables -->
                    </div>
                </div>


                <div class="alert alert-success alertcustom" id="alertcustom" style="display:none">
                   
                </div>
           



<%- include('../admin/footer'); %>
<script>
    $(document).ready(function () {
        $('#tbl_purchase').dataTable();
    });
</script>