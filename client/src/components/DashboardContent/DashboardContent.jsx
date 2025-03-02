import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  makeStyles,
  TableSortLabel,
  Box,
  TablePagination,
  Tooltip,
} from "@material-ui/core";
import exampleData from "./exampleData.json";
import DashboardFilters from "../DashboardFilters";
import { useDispatch } from "react-redux";

import Bookmark from "@material-ui/icons/Bookmark";
import MoreVert from "@material-ui/icons/MoreVert";
import Restore from "@material-ui/icons/Restore";
import AttatchFile from "@material-ui/icons/AttachFile";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { dashboardAction } from "../../store/actions/dashboardActions";
import UserHistory from "../../screens/UserHistory";
import Status from "../../screens/Status";
import ModalQuickRegistration from "../../screens/QuickRegistration/ModalQuickRegistration";
import Button from "../../components/Button/Button";

const useStyles = makeStyles(() => {
  return {
    container: {
      display: "flex",
      flexDirection: "column",
      maxWidth: "100%",
      width: "100%",
      margin: "0 auto",
      height: "100%",
      padding: "0 2rem",
    },

    content: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },
  };
});

const ExpandableTableRow = ({ children, expandComponent, ...otherProps }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow {...otherProps}>
        <TableCell padding="checkbox">
          <IconButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {children}
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell padding="checkbox" />
          {expandComponent}
        </TableRow>
      )}
    </>
  );
};

function DashboardContent() {
  const dashboard = useSelector((state) => state.dashboard);
  console.log(dashboard);

  const { container, content } = useStyles();
  const [data, setData] = useState(exampleData); // alterar p/ retorno da API
  const [order, setOrder] = useState("ASC");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // valor padrão
  const [modalIsOpenUserHistory, setIsOpenUserHistory] = useState(null);
  const [modalIsOpenStatus, setIsOpenStatus] = useState(null);
  const [modalIsOpenRegistration, setIsOpenRegistration] = useState(null);

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("ASC");
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, exampleData.length - page * rowsPerPage);

  const dispatch = useDispatch();

  useEffect(() => dispatch(dashboardAction()), []);

  return (
    <Fragment>
      <div className={container}>
        <DashboardFilters />
        <div className={content}>
          <MaUTable>
            <TableHead>
              <TableRow>
                <TableCell style={{ flex: 0.5 }} />
                <TableCell style={{ flex: 4 }} />
                <TableCell onClick={() => sorting("data")} style={{ flex: 3 }}>
                  <TableSortLabel>Data</TableSortLabel>
                </TableCell>
                <TableCell onClick={() => sorting("curso")}>
                  <TableSortLabel>Curso</TableSortLabel>
                </TableCell>
                <TableCell onClick={() => sorting("nome_completo")}>
                  <TableSortLabel>Nome Completo</TableSortLabel>
                </TableCell>
                <TableCell onClick={() => sorting("cidade")}>
                  <TableSortLabel>Cidade</TableSortLabel>
                </TableCell>
                <TableCell onClick={() => sorting("telefone")}>
                  <TableSortLabel>Telefone</TableSortLabel>
                </TableCell>
                <TableCell style={{ flex: 1 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((d, index) => (
                  <ExpandableTableRow
                    key={d.id}
                    expandComponent={
                      <div className="expandable-row">
                        <TableCell colSpan="1">
                          Historico: {d.historico}
                        </TableCell>
                        <TableCell colSpan="1">Email: {d.email}</TableCell>
                        <TableCell colSpan="1">Estado: {d.estado}</TableCell>
                        <TableCell colSpan="1">
                          Observacao: {d.observacao}
                        </TableCell>
                      </div>
                    }
                  >
                    <TableCell style={{ flex: 4 }}>
                      <Tooltip title="Alterar status">
                        <IconButton style={{ padding: "0.25rem" }}>
                          <Bookmark onClick={() => setIsOpenStatus(d)} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Histórico">
                        <IconButton style={{ padding: "0.25rem" }}>
                          <Restore onClick={() => setIsOpenUserHistory(d)} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Baixar anexo">
                        <IconButton style={{ padding: "0.25rem" }}>
                          <AttatchFile
                            onClick={() => console.log("AttatchFile")}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell component="th" scope="row" style={{ flex: 3 }}>
                      {d.data}
                    </TableCell>
                    <TableCell>{d.curso}</TableCell>
                    <TableCell>{d.nome_completo}</TableCell>
                    <TableCell>{d.cidade}</TableCell>
                    <TableCell>{d.telefone}</TableCell>
                    <TableCell style={{ flex: 1 }}>
                      <MoreVert
                        style={{ cursor: "Pointer" }}
                        onClick={() => console.log("MoreVert")}
                      />
                    </TableCell>
                  </ExpandableTableRow>
                ))}
            </TableBody>
          </MaUTable>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <span style={{ display: "block" }} />
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={exampleData.length}
              style={{ display: "block" }}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} linhas de ${count}`
              }
            />
            <Button onClick={() => setIsOpenRegistration(true)}>
              Cadastrar
            </Button>
          </Box>
        </div>
      </div>
      <UserHistory
        open={modalIsOpenUserHistory}
        onClose={() => setIsOpenUserHistory(null)}
      />
      <Status open={modalIsOpenStatus} onClose={() => setIsOpenStatus(null)} />
      <ModalQuickRegistration
        open={modalIsOpenRegistration}
        onClose={() => setIsOpenRegistration(null)}
      />
    </Fragment>
  );
}

export default DashboardContent;
