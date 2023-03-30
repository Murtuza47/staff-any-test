import React, { FunctionComponent, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { getErrorMessage } from "../helper/error/index";
import { deleteShiftById, getShifts, publishShift } from "../helper/api/shift";
import DataTable from "react-data-table-component";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink } from "react-router-dom";
import DateToggler from "../components/DateToggler";
import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import { Box, Button, Typography } from "@material-ui/core";
import { IShift } from "../interface/IShift";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  addBtn: {
    cursor: "pointer",
    borderColor: theme.color.turqouise,
    color: theme.color.turqouise,
  },
  publishBtn: {
    cursor: "pointer",
    background: theme.color.turqouise,
    color: " white",
  },
  textPublished: {
    color: theme.color.turqouise
  },
}));

interface ActionButtonProps {
  id: string;
  onDelete: () => void;
  isDisabled: boolean;
}
const ActionButton: FunctionComponent<ActionButtonProps> = ({
  id,
  onDelete,
  isDisabled
}) => {
  return (
    <div>
      <IconButton
        size="small"
        aria-label="delete"
        component={RouterLink}
        to={`/shift/${id}/edit`}
        disabled={isDisabled}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="delete" onClick={() => onDelete()} disabled={isDisabled}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const Shift = () => {
  const classes = useStyles();
  const history = useHistory();

  const [rows, setRows] = useState<IShift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [published, setPublished] = useState<boolean>(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const onDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  const onCloseDeleteDialog = () => {
    setSelectedId(null);
    setShowDeleteConfirm(false);
  };

  const handleDateToggler = (action: "forward" | "backward") => {
    switch (action) {
      case "forward":
        setDate(addWeeks(date, 1))
        break;
      case "backward":
        setDate(subWeeks(date, 1))
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        setErrMsg("");
        const { results } = await getShifts(format(startOfWeek(date), "yyyy-MM-dd"), format(endOfWeek(date), "yyyy-MM-dd"));
        setRows(results);
      } catch (error) {
        const message = getErrorMessage(error);
        setErrMsg(message);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [date]);

  useEffect(() => {
    if (rows.length > 0 && rows.every(row => row.published)) setPublished(true);
    else setPublished(false)
  }, [rows])

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Date",
      selector: "date",
      sortable: true,
    },
    {
      name: "Start Time",
      selector: "startTime",
      sortable: true,
    },
    {
      name: "End Time",
      selector: "endTime",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <ActionButton id={row.id} onDelete={() => onDeleteClick(row.id)} isDisabled={published} />
      ),
    },
  ];

  const deleteDataById = async () => {
    try {
      setDeleteLoading(true);
      setErrMsg("");

      if (selectedId === null) {
        throw new Error("ID is null");
      }

      await deleteShiftById(selectedId);

      const tempRows = [...rows];
      const idx = tempRows.findIndex((v: any) => v.id === selectedId);
      tempRows.splice(idx, 1);
      setRows(tempRows);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setDeleteLoading(false);
      onCloseDeleteDialog();
    }
  };

  const handlePublishShifts = async () => {
    try {
      setErrMsg("");
      const { results } = await publishShift(format(startOfWeek(date), "yyyy-MM-dd"), format(endOfWeek(date), "yyyy-MM-dd"))
      setRows(results)
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <DateToggler
                startOfWeek={startOfWeek(date)}
                endOfWeek={endOfWeek(date)}
                handleDateToggler={handleDateToggler}
                isPublished={published}
              />
              <Box display="flex" justifyContent="center" alignItems="center">
                {published && (
                  <>
                    <Typography
                      className={classes.textPublished}
                      noWrap
                    >
                      Week published on {rows[0]?.publishedDate}
                    </Typography>
                    &nbsp;&nbsp;&nbsp;
                  </>
                )}
                <Button
                  variant="outlined"
                  onClick={() => history.push("/shift/add")}
                  startIcon={<AddIcon />}
                  disabled={published}
                  className={classes.addBtn}
                >
                  ADD SHIFT
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button
                  variant="contained"
                  onClick={handlePublishShifts}
                  disabled={published || rows.length === 0}
                  className={classes.publishBtn}
                >
                  {published ? 'PUBLISHED' : 'PUBLISH'}
                </Button>
              </Box>
            </Box>
            {errMsg?.length > 0 ? (
              <Alert severity="error">{errMsg}</Alert>
            ) : (
              <></>
            )}
            <DataTable
              title="Shifts"
              columns={columns}
              data={rows}
              pagination
              progressPending={isLoading}
            />
          </CardContent>
        </Card>
      </Grid>
      <ConfirmDialog
        title="Delete Confirmation"
        description={`Do you want to delete this data ?`}
        onClose={onCloseDeleteDialog}
        open={showDeleteConfirm}
        onYes={deleteDataById}
        loading={deleteLoading}
      />
    </Grid>
  );
};

export default Shift;
