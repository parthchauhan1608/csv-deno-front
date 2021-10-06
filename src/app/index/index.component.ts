import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }
  
  records: any[] = [];
  header: any[] = [];  
  checkedHeader: any = [];
  @ViewChild('csvReader') csvReader: any;  
  
  uploadListener($event: any): void {  
  
    let text = [];  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        this.header = this.getHeaderArray(csvRecordsArray);  
        this.checkedHeader = Array(this.header.length);
        this.checkedHeader.fill(1);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, this.header.length);
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      this.toastr.error("Please import valid .csv file.");
      this.fileReset();  
    }  
  } 
  
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) {  
        csvArr.push(curruntRecord);  
      }  
    }  
    return csvArr;  
  }  
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  
  fileReset() {  
    this.csvReader.nativeElement.value = "";  
    this.records = []; 
    this.header = []; 
    this.checkedHeader = [];
  }

  moveColumn(i: any, i1: any){
    let tempHeader = this.header[i];
    this.header[i] = this.header[i1];
    this.header[i1] = tempHeader;

    let tempcheck = this.checkedHeader[i];
    this.checkedHeader[i] = this.checkedHeader[i1];
    this.checkedHeader[i1] = tempcheck;

    for(let rec in this.records){
      let tempRecord = this.records[rec][i];
      this.records[rec][i] = this.records[rec][i1];
      this.records[rec][i1] = tempRecord;
    }
  }

  checkInvert(i){
    if(this.checkedHeader[i]){
      this.checkedHeader[i] = 0;
    }
    else {
      this.checkedHeader[i] = 1;
    }
  }

  exportFile(){
    let head: any = ''
    for(let i in this.header){
      if(this.checkedHeader[i]){
        if(head){
          head = head + ',';
        }
        head += this.header[i];
      }
    }
    if(!head){
      this.toastr.error("Please select at least one column.")
      return;
    }

    let csv: any = [];
    for(let i in this.records){
      let recod: any = '';
      for(let i1 in this.records[i]){
        if(this.checkedHeader[i1]){
          if(recod){
            recod = recod + ',';
          }
          recod += this.records[i][i1];
        }
      }
      csv.push(recod);
    }

    csv.unshift(head);
    let csvArray = csv.join('\r\n');

    console.log(csvArray)
    let blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, "myFile.csv");
  }
}
