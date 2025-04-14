/* eslint-disable no-undefined */
/* eslint-disable no-undef */
import Vue from 'vue';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';


Vue.mixin({
  methods: {
    cellSingleFieldExtractor(cell, params) {
      //  if the value of the field is an object extract the referenceKey field and return it
      //  expects a string value with either an array of objects or a single object
      if (cell.value == null) { return ' '; }

      let parsedCell = cell.value;
      let delimitChar = ',';
      if (params.delimitChar) {
        delimitChar = params.delimitChar;
      }
      let extractedValues = '';
      if (Array.isArray(parsedCell)) {
        // for (let i = 0; i < parsedCell.length; i++)
        parsedCell.forEach((item, i) => {
          if (parsedCell[i][params.referenceKey]) {
            extractedValues += parsedCell[i][params.referenceKey];
            if (parsedCell.length > 1 && i < parsedCell.length - 1) {
              extractedValues += ` ${delimitChar} `;
            }
          }
        });
        return extractedValues;
      }
      if (typeof (parsedCell) === 'object') {
        let extractedValues = '';
        extractedValues = parsedCell[0][params.referenceKey];
      } else {
        extractedValues = 'not correct type';
      }
    },

    cellRoundTo6(cell, params) {
      if (cell.value == null) { return ' '; }
      const x = cell.value.toFixed(6);
      return x;
    },

    cellHyperlink(cell, params) {
      if (cell.value == null) { return ' '; }
      const base = process.env.APPLICATION_ROUTER_BASE;
      const appUrl = process.env.APPLICATION_EXTERNAL_LINK_URL;
      const {route} = params;
      const id = (params.useValue === true) ? cell.value : '';
      let link = (params.externalLink) ? params.externalLink : `${appUrl}${base}${route}`;
      let {text} = cell;
      if (params.linkTitle && text.length < 10) {
        const h = {
          text: text,
        };
        return;
      }
      if (params.linkTitle && text.length >= 10) {
        text = params.linkTitle;
        link = cell.text;
      }
      cell.font = {
        name: 'Arial',
        color: {argb: '0E6993'},
      };
      const h = {
        text: text,
        hyperlink: `${link}${id}`,
      };

      return h;
    },
    cellDelimitedJoin(cell, params) {
      // this formatter is specifically for the xxx/yyy display.
      // it finds the referenced field in the columns and only takes the first value in referenceFields
      if (cell.text === '') { return ' '; }
      const x = cell.text;
      const denom = params.refFieldValues[params.referenceFields[0]];
      return `${x}/${denom}`;
    },
    splitInchiString(cell, params) {
      // one off formatter specifically to remove auxinfo from inchiString
      return (cell.value) ? cell.value.split('\nAux')[0] : '';
    },

    extractHitCall(cell, params) {
      switch (cell.value) {
      case 1:
        return 'Active';
      case 0:
        return 'Inactive';
      case -1:
        return 'Inconclusive';
      default:
        return cell.value;
      }
    },
    cellFormatDate(cell, params) {
      return $nuxt.dateFormat(new Date(cell.value), 'MMMM dd, yyyy');
    },
    predictionCellHyperLink(cell, params) {
      const obj = cell.value;
      let h;
      let text = null;
      let link = null;
      if (obj) {
        if ((obj.name || obj.link) !== null) {
          text = obj.name.toString();
          link = obj.link.toString();
        }

        if (params.fileFormat === 'csv') {
          h = text;
        } else if (params.fileFormat === 'xlsx') {
          if ((text || link) !== null) {
            h = {
              text: text,
              hyperlink: link,
            };
          } else {
            h = '';
          }
        }
        return h;
      }
      return '';
    },

    async exportData(config) {
      // link to formatting functions above
      // add new entries here for each formatter above
      const cellFormatters = {
        cellHyperlink: $nuxt.cellHyperlink,
        cellDelimitedJoin: $nuxt.cellDelimitedJoin,
        cellRoundTo6: $nuxt.cellRoundTo6,
        cellSingleFieldExtractor: $nuxt.cellSingleFieldExtractor,
        splitInchiString: $nuxt.splitInchiString,
        extractHitCall: $nuxt.extractHitCall,
        cellFormatDate: $nuxt.cellFormatDate,
        predictionCellHyperLink: $nuxt.predictionCellHyperLink,
      };

      const hasSelectedRows = config.gridApi.getSelectedRows().length > 0;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Worksheet1');

      const colsToFormat = config.columns.filter(el => (el.formatter !== undefined));
      worksheet.columns = config.columns;


      // append records to worksheet
      config.gridApi.forEachNodeAfterFilterAndSort((node, index) => {
        if (((hasSelectedRows && (node.data.selected || node.selected))) || !hasSelectedRows) {
          const rowData = node.data;
          if (config.splitFields && config.splitFields.length > 0) {
            config.splitFields.forEach((fld) => {
              fld.keys.forEach((key) => {
                const newFldName = `${fld.fieldToSplit}_${key}`;

                const g = fld.fieldToSplit;
                rowData[newFldName] = rowData[g][key];
              });
            });
          }
          if (config.deriveFields && config.deriveFields.length > 0) {
            config.deriveFields.forEach((deriveConfig) => {
              rowData[deriveConfig.target] = node.data[deriveConfig.source];
            });
          }
          worksheet.addRow(rowData);
        }
      });
      // format the header record
      worksheet.getRow(1).eachCell((cell, cellNumber) => {
        cell.font = {
          bold: true,
        };
      });
      // freeze header row and first column
      if (config.splitSheet) {
        worksheet.views = [
          {
            state: 'frozen', xSplit: config.splitSheet.xSplit, ySplit: config.splitSheet.ySplit, activeCell: 'B2',
          },
        ];
      }


      // format the cells that need it based on the formatter property in the exportColDefs
      colsToFormat.forEach((col) => {
        const column2Format = worksheet.getColumn(col.key);
        let formatterParams = {};
        column2Format.eachCell((cell, rowNumber) => {
          if (rowNumber !== 1) {
            if (col.formatterParams) {
              formatterParams = col.formatterParams;
              formatterParams.fileFormat = config.fileFormat || '';
              const refFieldValues = {};
              if (col.formatterParams.referenceFields) {
                col.formatterParams.referenceFields.forEach((fld) => {
                  refFieldValues[fld] = worksheet.getRow(rowNumber).getCell(fld).value;
                });
              }
              formatterParams.refFieldValues = refFieldValues;
            }

            const formatterName = col.formatter;
            cell.value = cellFormatters[formatterName](cell, formatterParams);
          }
        });
      });

      async function filterBlobToString(blob) {
        const text = await new Response(blob).text();
        const string = text.replaceAll(' °C', '°C');
        return string;
      }
      if (config.fileFormat && config.fileFormat === 'csv') {
        await workbook.csv.writeBuffer().then((data) => {
          const blob = new Blob([data], {type: 'data:text/csv; charset=utf-8'});
          const universalBOM = '\uFEFF';
          filterBlobToString(blob).then((str) => {
            const filteredBlob = new Blob([universalBOM + str], {type: 'data:text/csv; charset=utf-8'});
            saveAs(filteredBlob, `${config.fileName}.csv`);
          });
        });
      } else {
        await workbook.xlsx.writeBuffer().then((data) => {
          const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          saveAs(blob, `${config.fileName}.xlsx`);
        });
      }


      return 1;
    },

  },
});
