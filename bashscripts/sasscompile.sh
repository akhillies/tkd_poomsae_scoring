#!/usr/bin/bash

sourcefile='*./scss';
destfile='*./css';
compression='compressed';


while getopts 'c:s:d:' flag; do
  case "${flag}" in
    c)
        compression="${OPTARG}";
        ;;
    s)
        sourcefile="${OPTARG}";
        ;;
    d)
        destfile="${OPTARG}";
        ;;
    *)
        error "Unexpected option ${flag}"
        ;;
  esac
done

sass -t $compression -l $sourcefile:$destfile; 
